-- ==========================================
-- EXTENSIONES DEL MODELO DE DATOS (Fase 2)
-- 1. Operational Status, Finding Actions, Service Opportunities
-- ==========================================

-- Nuevos ENUMS
create type operational_status as enum ('apto', 'apto_condicionado', 'no_apto', 'fuera_servicio');
create type action_status as enum ('pending', 'completed', 'cancelled');
create type opportunity_status as enum ('open', 'contacted', 'proposal_sent', 'closed_won', 'closed_lost');

-- Alterar tabla Equipments para estado operativo
alter table public.equipments
add column operational_status operational_status;

-- Nueva Tabla: Acciones de Seguimiento a Hallazgos
create table public.finding_actions (
    id uuid primary key default uuid_generate_v4(),
    evidence_id uuid references public.evidences(id) on delete cascade not null,
    responsible_name text not null, -- Can be an internal user or client contact
    due_date date not null,
    status action_status not null default 'pending',
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Nueva Tabla: Oportunidades de Servicio (Capa Comercial)
create table public.service_opportunities (
    id uuid primary key default uuid_generate_v4(),
    certificate_id uuid references public.certificates(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    status opportunity_status not null default 'open',
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==========================================
-- TRIGGERS Y LÓGICA
-- ==========================================

-- Trigger: Actualizar estado operativo del equipo cuando se emite una inspección
create or replace function public.update_equipment_operational_status()
returns trigger as $$
begin
    -- Only act if the inspection is just being emitted and has a result
    if new.status = 'emitido' and old.status != 'emitido' and new.result is not null then
        update public.equipments
        set operational_status = case 
            when new.result = 'aprobado' then 'apto'::operational_status
            when new.result = 'condicional' then 'apto_condicionado'::operational_status
            when new.result = 'rechazado' then 'no_apto'::operational_status
        end
        where id = new.equipment_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger on_inspection_emitted_update_equipment
    after update on public.inspections
    for each row execute procedure public.update_equipment_operational_status();


-- ==========================================
-- RLS PARA NUEVAS TABLAS
-- ==========================================

alter table public.finding_actions enable row level security;
alter table public.service_opportunities enable row level security;

create policy "Admins manage all actions" on public.finding_actions for all using ( public.is_admin() );
create policy "Inspectors manage actions on their inspections" on public.finding_actions for all using (
    exists (
        select 1 from public.evidences e
        join public.inspections i on e.inspection_id = i.id
        where e.id = evidence_id and i.inspector_id = auth.uid()
    )
);

-- Service opportunities are mostly for Admin/Commercial roles. Inspectors can view them for their clients.
create policy "Admins manage all opportunities" on public.service_opportunities for all using ( public.is_admin() );
create policy "Inspectors can view opportunities for their clients" on public.service_opportunities for select using (
    exists (select 1 from public.clients c where c.id = client_id and c.created_by = auth.uid())
);
