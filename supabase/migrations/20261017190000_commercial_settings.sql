-- Configuración comercial editable: historias y presupuesto publicitario recomendado.
-- El precio de las historias queda vacío hasta que el administrador lo defina.

CREATE TABLE IF NOT EXISTS public.commercial_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  stories_price_usd NUMERIC(14, 2),
  stories_quantity INTEGER,
  stories_platform TEXT,
  stories_content_type TEXT,
  stories_includes_design BOOLEAN NOT NULL DEFAULT true,
  stories_includes_copy BOOLEAN NOT NULL DEFAULT true,
  stories_includes_scheduling BOOLEAN NOT NULL DEFAULT true,
  recommended_ad_budget_usd NUMERIC(14, 2) NOT NULL DEFAULT 150,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.commercial_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.commercial_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "commercial_settings_admin_all" ON public.commercial_settings;
CREATE POLICY "commercial_settings_admin_all"
  ON public.commercial_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS tr_commercial_settings_updated ON public.commercial_settings;
CREATE TRIGGER tr_commercial_settings_updated
  BEFORE UPDATE ON public.commercial_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DO $$ BEGIN
  ALTER TYPE public.contract_status ADD VALUE 'pending_review';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE public.contract_status ADD VALUE 'pending_acceptance';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
