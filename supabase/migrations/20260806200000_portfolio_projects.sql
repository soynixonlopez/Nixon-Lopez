-- ============================================================================
-- Portafolio público (carrusel Home) — gestión desde /admin/portafolio
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  slug TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  category_tone TEXT NOT NULL DEFAULT 'blue'
    CHECK (category_tone IN ('blue', 'green', 'purple', 'orange', 'pink')),
  description TEXT NOT NULL,
  demo_url TEXT NOT NULL,

  image_url TEXT NOT NULL,
  image_path TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  show_on_home BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_home
  ON public.portfolio_projects (show_on_home, is_published, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_sort
  ON public.portfolio_projects (sort_order ASC, created_at DESC);

DROP TRIGGER IF EXISTS tr_portfolio_projects_updated ON public.portfolio_projects;
CREATE TRIGGER tr_portfolio_projects_updated
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_projects_admin_all" ON public.portfolio_projects;
CREATE POLICY "portfolio_projects_admin_all"
  ON public.portfolio_projects
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Lectura pública de proyectos publicados (SSR / anon)
DROP POLICY IF EXISTS "portfolio_projects_public_select" ON public.portfolio_projects;
CREATE POLICY "portfolio_projects_public_select"
  ON public.portfolio_projects
  FOR SELECT
  USING (is_published = true);

COMMENT ON TABLE public.portfolio_projects IS
  'Proyectos del portafolio web (Home carrusel). Distinto de public.projects (seguimiento interno).';

-- Storage: bucket público para imágenes optimizadas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "portfolio_storage_public_read" ON storage.objects;
CREATE POLICY "portfolio_storage_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "portfolio_storage_admin_insert" ON storage.objects;
CREATE POLICY "portfolio_storage_admin_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

DROP POLICY IF EXISTS "portfolio_storage_admin_update" ON storage.objects;
CREATE POLICY "portfolio_storage_admin_update"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

DROP POLICY IF EXISTS "portfolio_storage_admin_delete" ON storage.objects;
CREATE POLICY "portfolio_storage_admin_delete"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio' AND public.is_admin());
