-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type user_role as enum ('admin', 'inspector');
create type inspection_status as enum ('borrador', 'listo_para_emitir', 'emitido');
create type certificate_status as enum ('vigente', 'por_vencer', 'vencido', 'anulado');

-- 2. USERS AND ROLES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'inspector',
  full_name text not null,
  email text not null,
  company_id uuid, -- For future multi-tenant support
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. CORE CATALOGS
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table inspection_catalog (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  equipment_type text not null,
  periodicity_days integer not null default 365,
  catalog_version integer not null default 1, -- Versioning for checklists
  active boolean default true,
  created_at timestamptz default now()
);

-- 4. OPERATIONS (Clients & Equipments)
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_email text,
  contact_phone text,
  address text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table equipments (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  brand_id uuid references brands(id) not null,
  model text not null,
  serial_number text not null,
  manufacture_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. INSPECTIONS
create table inspections (
  id uuid primary key default uuid_generate_v4(),
  inspector_id uuid references profiles(id) not null,
  client_id uuid references clients(id) not null,
  equipment_id uuid references equipments(id) not null,
  catalog_id uuid references inspection_catalog(id) not null,
  status inspection_status not null default 'borrador',
  signature_url text, -- Storage URL for digital signature
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table inspection_items (
  id uuid primary key default uuid_generate_v4(),
  inspection_id uuid references inspections(id) on delete cascade not null,
  description text not null,
  is_compliant boolean,
  is_finding boolean default false,
  created_at timestamptz default now()
);

create table evidences (
  id uuid primary key default uuid_generate_v4(),
  inspection_id uuid references inspections(id) on delete cascade not null,
  item_id uuid references inspection_items(id) on delete cascade, -- Optional, could be a general photo
  file_url text not null, -- Storage URL
  comment text,
  is_finding boolean default false, -- Flag if this specific photo is a finding
  created_at timestamptz default now()
);

-- 6. CERTIFICATES & SNAPSHOT
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  unique_code text unique not null, -- Pre-generated or short UUID for QR
  inspection_id uuid references inspections(id) not null,
  equipment_id uuid references equipments(id) not null,
  emission_date date not null default current_date,
  expiration_date date not null,
  status certificate_status not null default 'vigente',
  certificate_url text, -- URL to the frozen PDF in Storage
  snapshot jsonb not null, -- Frozen view of all equipment, client, and item data at emission time
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. NOTIFICATIONS & AUDIT
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null, -- e.g., 'certificate_expiring', 'inspection_assigned'
  is_read boolean default false,
  related_entity_id uuid, -- Can be certificate_id, etc.
  created_at timestamptz default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  table_name text not null,
  record_id uuid not null,
  action text not null, -- INSERT, UPDATE, DELETE
  user_id uuid references profiles(id),
  changes jsonb not null,
  timestamp timestamptz default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) - DRAFT POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table brands enable row level security;
alter table inspection_catalog enable row level security;
alter table clients enable row level security;
alter table equipments enable row level security;
alter table inspections enable row level security;
alter table inspection_items enable row level security;
alter table evidences enable row level security;
alter table certificates enable row level security;
alter table notifications enable row level security;

-- (Policies will be strictly defined in subsequent files, ensuring Admin sees all and Inspector sees own)
