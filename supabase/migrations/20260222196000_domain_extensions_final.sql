-- ==========================================
-- EXTENSIONES DEL MODELO DE DATOS (Fase 4 - Final Product Layer)
-- 1. Supervisor Role
-- ==========================================

-- Alter the user_role enum to add 'supervisor'. 
-- Note: 'alter type add value' cannot be wrapped in a transaction block in some older PG versions, but usually safe in Supabase standalone migrations.
alter type public.user_role add value if not exists 'supervisor';

-- Helper function to identify supervisors
create or replace function public.is_supervisor()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'supervisor'::public.user_role
  );
end;
$$ language plpgsql security definer;

-- ==========================================
-- RLS PARA SUPERVISOR (Read-Only access to operation tables)
-- ==========================================

-- Supervisors can view all equipment, clients, inspections and certificates but cannot mutate.

create policy "Supervisors read all equipments" on public.equipments for select using ( public.is_supervisor() );
create policy "Supervisors read all clients" on public.clients for select using ( public.is_supervisor() );
create policy "Supervisors read all inspections" on public.inspections for select using ( public.is_supervisor() );
create policy "Supervisors read all finding actions" on public.finding_actions for select using ( public.is_supervisor() );
create policy "Supervisors read all certificates" on public.certificates for select using ( public.is_supervisor() );
create policy "Supervisors read all equipment events" on public.equipment_events for select using ( public.is_supervisor() );

-- Admins retain full control, inspectors keep client-scoped access. Emitting certificates, adding equipments remains restricted to Inspectors/Admins.
