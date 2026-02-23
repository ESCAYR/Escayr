-- ==========================================
-- EXTENSIONES DEL MODELO DE DATOS
-- 1. Authorization, Structured Checklists, Results, Docs
-- ==========================================

-- Nuevos ENUMS
create type inspection_result as enum ('aprobado', 'rechazado', 'condicional');
create type item_category as enum ('textil', 'plastico', 'metalico', 'partes_moviles', 'seguros');
create type document_type as enum ('inspection_certificate', 'technical_sheet', 'conformity_certificate', 'inspector_certificate');

-- Alterar tablas existentes para agregar nuevos campos
alter table public.inspections
add column result inspection_result;

alter table public.inspection_items
add column category item_category not null default 'textil';

-- Nueva tabla: Autorización de Inspectores por Marca
create table public.inspector_brands (
    inspector_id uuid references public.profiles(id) on delete cascade,
    brand_id uuid references public.brands(id) on delete cascade,
    granted_at timestamptz default now(),
    primary key (inspector_id, brand_id)
);

-- Nueva tabla: Gestión Documental por Equipo
create table public.equipment_documents (
    id uuid primary key default uuid_generate_v4(),
    equipment_id uuid references public.equipments(id) on delete cascade not null,
    certificate_id uuid references public.certificates(id) on delete set null, -- Nullable if it's just a general doc like technical sheet
    document_type document_type not null,
    file_url text not null,
    uploaded_at timestamptz default now()
);

-- ==========================================
-- RLS PARA NUEVAS TABLAS
-- ==========================================

alter table public.inspector_brands enable row level security;
alter table public.equipment_documents enable row level security;

create policy "Admins can manage inspector brand auths" on public.inspector_brands for all using ( public.is_admin() );
create policy "Inspectors can view their brand auths" on public.inspector_brands for select using ( inspector_id = auth.uid() );

-- Solo permitir crear inspecciones si el inspector está autorizado para la marca del equipo (Usando Trigger o Check RLS)
-- Para que el insert evalúe la tabla referenciada:
create policy "Inspectors can insert inspections for authorized brands" on public.inspections for insert with check (
    public.is_admin() or exists (
        select 1 from public.equipments e
        join public.inspector_brands ib on e.brand_id = ib.brand_id
        where e.id = equipment_id and ib.inspector_id = auth.uid()
    )
);

create policy "Admins can manage all equipment docs" on public.equipment_documents for all using ( public.is_admin() );
create policy "Inspectors can manage docs for their client's equipment" on public.equipment_documents for all using (
    exists (
        select 1 from public.equipments e
        join public.clients c on e.client_id = c.id
        where e.id = equipment_id and c.created_by = auth.uid()
    )
);

