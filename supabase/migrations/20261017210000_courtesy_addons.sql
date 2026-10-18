-- Agregados de cortesía configurables por el administrador (JSON sobre catálogo base en código).

ALTER TABLE public.commercial_settings
  ADD COLUMN IF NOT EXISTS courtesy_addons JSONB NOT NULL DEFAULT '[]'::jsonb;
