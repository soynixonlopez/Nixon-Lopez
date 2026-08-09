-- ============================================================================
-- Blog CMS — artículos públicos + gestión /admin/blog
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  previous_slugs TEXT[] NOT NULL DEFAULT '{}',
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',

  featured_image_url TEXT,
  featured_image_path TEXT,
  featured_image_alt TEXT NOT NULL DEFAULT '',

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,

  author_name TEXT NOT NULL DEFAULT 'Nixon López',
  category TEXT NOT NULL DEFAULT 'Desarrollo Web',
  tags TEXT[] NOT NULL DEFAULT '{}',

  seo_title TEXT,
  seo_description TEXT
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published
  ON public.blog_posts (status, published_at DESC NULLS LAST)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_blog_posts_previous_slugs
  ON public.blog_posts USING GIN (previous_slugs);

DROP TRIGGER IF EXISTS tr_blog_posts_updated ON public.blog_posts;
CREATE TRIGGER tr_blog_posts_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_admin_all" ON public.blog_posts;
CREATE POLICY "blog_posts_admin_all"
  ON public.blog_posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "blog_posts_public_select" ON public.blog_posts;
CREATE POLICY "blog_posts_public_select"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

COMMENT ON TABLE public.blog_posts IS
  'Artículos del blog público. Drafts solo visibles para admin (RLS).';

-- Storage bucket para imágenes del blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog',
  'blog',
  true,
  8388608,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "blog_storage_public_read" ON storage.objects;
CREATE POLICY "blog_storage_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog');

DROP POLICY IF EXISTS "blog_storage_admin_insert" ON storage.objects;
CREATE POLICY "blog_storage_admin_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog' AND public.is_admin());

DROP POLICY IF EXISTS "blog_storage_admin_update" ON storage.objects;
CREATE POLICY "blog_storage_admin_update"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog' AND public.is_admin())
  WITH CHECK (bucket_id = 'blog' AND public.is_admin());

DROP POLICY IF EXISTS "blog_storage_admin_delete" ON storage.objects;
CREATE POLICY "blog_storage_admin_delete"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog' AND public.is_admin());
