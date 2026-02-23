-- ==========================================
-- 1. HELPER FUNCTIONS
-- ==========================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles
create policy "Admins are omnipotent" on public.profiles for all using ( public.is_admin() );
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

-- Brands & Catalog
create policy "Admins can manage brands" on public.brands for all using ( public.is_admin() );
create policy "Everyone can view active brands" on public.brands for select using ( active = true );

create policy "Admins can manage catalog" on public.inspection_catalog for all using ( public.is_admin() );
create policy "Everyone can view active catalog" on public.inspection_catalog for select using ( active = true );

-- Clients
create policy "Admins can manage all clients" on public.clients for all using ( public.is_admin() );
create policy "Inspectors can manage own clients" on public.clients for all using ( created_by = auth.uid() );

-- Equipments
create policy "Admins can manage all equipments" on public.equipments for all using ( public.is_admin() );
create policy "Inspectors can view equipments of their clients" on public.equipments for select using (
  exists (select 1 from public.clients c where c.id = public.equipments.client_id and c.created_by = auth.uid())
);
create policy "Inspectors can insert equipments for their clients" on public.equipments for insert with check (
  exists (select 1 from public.clients c where c.id = client_id and c.created_by = auth.uid())
);
create policy "Inspectors can update equipments of their clients" on public.equipments for update using (
  exists (select 1 from public.clients c where c.id = public.equipments.client_id and c.created_by = auth.uid())
);

-- Inspections
create policy "Admins can manage all inspections" on public.inspections for all using ( public.is_admin() );
create policy "Inspectors can manage own inspections" on public.inspections for all using ( inspector_id = auth.uid() );
-- Block update if inspection is emitted
create policy "Block edit of emitted inspections" on public.inspections for update using (
  status != 'emitido' or public.is_admin()
);

-- Items and Evidences
create policy "Admins can manage all items" on public.inspection_items for all using ( public.is_admin() );
create policy "Inspectors can manage items of own inspections" on public.inspection_items for all using (
  exists (select 1 from public.inspections i where i.id = inspection_id and i.inspector_id = auth.uid())
);

create policy "Admins can manage all evidences" on public.evidences for all using ( public.is_admin() );
create policy "Inspectors can manage evidences of own inspections" on public.evidences for all using (
  exists (select 1 from public.inspections i where i.id = inspection_id and i.inspector_id = auth.uid())
);

-- Certificates
create policy "Admins can view all certificates" on public.certificates for select using ( true );
create policy "Inspectors can view certificates of their clients/inspections" on public.certificates for select using (
  exists (select 1 from public.inspections i where i.id = inspection_id and i.inspector_id = auth.uid())
);

-- Notifications
create policy "Users can view own notifications" on public.notifications for select using ( user_id = auth.uid() );
create policy "Users can update own notifications" on public.notifications for update using ( user_id = auth.uid() );

-- ==========================================
-- 3. TRIGGERS & FUNCTIONS
-- ==========================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Usuario'), new.email, coalesce((new.raw_user_meta_data->>'role')::user_role, 'inspector'::user_role));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updating `updated_at` columns
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_clients_updated_at before update on clients for each row execute procedure update_updated_at_column();
create trigger update_equipments_updated_at before update on equipments for each row execute procedure update_updated_at_column();
create trigger update_inspections_updated_at before update on inspections for each row execute procedure update_updated_at_column();
create trigger update_certificates_updated_at before update on certificates for each row execute procedure update_updated_at_column();

-- Function to publicly verify a certificate
create or replace function public.verify_certificate(cert_code text)
returns json as $$
declare
  cert_record record;
begin
  select 
    c.id, c.unique_code, c.emission_date, c.expiration_date, c.status, c.certificate_url,
    eq.model, eq.serial_number, eq.manufacture_date,
    b.name as brand_name,
    cl.name as client_name,
    p.full_name as inspector_name,
    ic.name as inspection_type
  into cert_record
  from public.certificates c
  join public.equipments eq on c.equipment_id = eq.id
  join public.brands b on eq.brand_id = b.id
  join public.clients cl on eq.client_id = cl.id
  join public.inspections i on c.inspection_id = i.id
  join public.profiles p on i.inspector_id = p.id
  join public.inspection_catalog ic on i.catalog_id = ic.id
  where c.unique_code = cert_code;

  if not found then
    return null;
  end if;

  return row_to_json(cert_record);
end;
$$ language plpgsql security definer;
