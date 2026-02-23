import { createClient } from '@supabase/supabase-js';

// Environment variables should be defined in .env
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types derived from DB (Simplified conceptually)
export type Profile = {
    id: string;
    role: 'admin' | 'inspector';
    full_name: string;
    email: string;
};

export type Certificate = {
    id: string;
    unique_code: string;
    inspection_id: string;
    equipment_id: string;
    emission_date: string;
    expiration_date: string;
    status: 'vigente' | 'por_vencer' | 'vencido' | 'anulado';
    certificate_url: string;
    snapshot: any;
};
