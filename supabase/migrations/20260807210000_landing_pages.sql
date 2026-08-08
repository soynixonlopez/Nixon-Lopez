-- ============================================================================
-- Landing pages editables (CMS) — /admin/landings → pública /l/[slug]
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,

  -- Precio del servicio ofrecido
  price_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  price_label TEXT NOT NULL DEFAULT 'Precio',
  price_note TEXT,

  -- Contenido estructurado (hero, beneficios, CTA, imágenes…)
  content JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Integraciones de pago
  payment JSONB NOT NULL DEFAULT '{}'::jsonb,

  seo_title TEXT,
  seo_description TEXT
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_published
  ON public.landing_pages (is_published, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_landing_pages_slug
  ON public.landing_pages (slug);

DROP TRIGGER IF EXISTS tr_landing_pages_updated ON public.landing_pages;
CREATE TRIGGER tr_landing_pages_updated
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "landing_pages_admin_all" ON public.landing_pages;
CREATE POLICY "landing_pages_admin_all"
  ON public.landing_pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "landing_pages_public_select" ON public.landing_pages;
CREATE POLICY "landing_pages_public_select"
  ON public.landing_pages
  FOR SELECT
  USING (is_published = true);

COMMENT ON TABLE public.landing_pages IS
  'Landings comerciales generadas desde el panel admin (contenido + pagos).';

-- Reutiliza bucket portfolio o crea landings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'landings',
  'landings',
  true,
  8388608,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "landings_public_read" ON storage.objects;
CREATE POLICY "landings_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'landings');

DROP POLICY IF EXISTS "landings_admin_write" ON storage.objects;
CREATE POLICY "landings_admin_write"
  ON storage.objects FOR ALL
  USING (bucket_id = 'landings' AND public.is_admin())
  WITH CHECK (bucket_id = 'landings' AND public.is_admin());
