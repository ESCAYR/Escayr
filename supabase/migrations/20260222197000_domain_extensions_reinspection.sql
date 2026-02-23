-- ==========================================
-- EXTENSIONES DEL MODELO DE DATOS (Fase 5 - Reinspections)
-- 1. Reinspection self-reference
-- ==========================================

-- Permite vincular una nueva inspección a una inspección previa para trazar la evolución (ej. después de un mantenimiento)
alter table public.inspections
add column reinspection_of uuid references public.inspections(id) on delete set null;

-- Agregar política básica de lectura, heredada de la tabla misma, no requiere RLS adicional
-- Los triggers existentes generarán eventos normalmente.
