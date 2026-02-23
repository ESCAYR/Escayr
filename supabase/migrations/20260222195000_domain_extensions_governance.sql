-- ==========================================
-- EXTENSIONES DEL MODELO DE DATOS (Fase 3 - Governance)
-- 1. Certificate Versioning, Integrity, Event Timeline
-- ==========================================

-- Añadir campos de gobernanza al certificado
alter table public.certificates
add column certificate_version text not null default '1.0',
add column certificate_hash text;

-- Enum para tipos de eventos de equipo
create type equipment_event_type as enum (
    'inspection_emitted',
    'inspection_rejected',
    'finding_action_created',
    'document_uploaded',
    'certificate_annulled',
    'maintenance_performed'
);

-- Nueva tabla de eventos del equipo (Línea de tiempo)
create table public.equipment_events (
    id uuid primary key default uuid_generate_v4(),
    equipment_id uuid references public.equipments(id) on delete cascade not null,
    event_type equipment_event_type not null,
    description text not null,
    metadata jsonb default '{}'::jsonb, -- Store extra info (e.g. certificate_id, document_id)
    created_at timestamptz default now(),
    created_by uuid references auth.users(id) -- Quién disparó el evento (puede ser nulo si es sistema)
);

-- ==========================================
-- TRIGGERS PARA TIMELINE
-- ==========================================

-- Trigger: Registrar evento en equipments cuando se emita una inspección
create or replace function public.log_equipment_inspection_event()
returns trigger as $$
begin
    -- Solamente actuar cuando la inspección cambia a estado emitido
    if new.status = 'emitido' and old.status != 'emitido' then
        insert into public.equipment_events (equipment_id, event_type, description, metadata, created_by)
        values (
            new.equipment_id,
            case when new.result = 'rechazado' then 'inspection_rejected'::equipment_event_type else 'inspection_emitted'::equipment_event_type end,
            'Inspección finalizada con resultado: ' || new.result,
            jsonb_build_object('inspection_id', new.id, 'result', new.result),
            new.inspector_id
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger on_inspection_emitted_log_event
    after update on public.inspections
    for each row execute procedure public.log_equipment_inspection_event();

-- Trigger: Registrar subida de documentos
create or replace function public.log_equipment_document_upload()
returns trigger as $$
begin
    insert into public.equipment_events (equipment_id, event_type, description, metadata)
    values (
        new.equipment_id,
        'document_uploaded'::equipment_event_type,
        'Documento tipo ' || new.document_type || ' ha sido adjuntado.',
        jsonb_build_object('document_id', new.id, 'document_type', new.document_type)
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_document_uploaded_log_event
    after insert on public.equipment_documents
    for each row execute procedure public.log_equipment_document_upload();


-- ==========================================
-- RLS PARA TIMELINE
-- ==========================================

alter table public.equipment_events enable row level security;

-- Admins can read all events
create policy "Admins can view all equipment events" on public.equipment_events for select using ( public.is_admin() );

-- Inspectors can read events for equipments of clients they manage
create policy "Inspectors can view events for their clients" on public.equipment_events for select using (
    exists (
        select 1 from public.equipments eq
        join public.clients c on eq.client_id = c.id
        where eq.id = equipment_id and c.created_by = auth.uid()
    )
);

-- Note: Inserts to equipment_events are mostly handled by backend triggers bypassing RLS (security definer).

