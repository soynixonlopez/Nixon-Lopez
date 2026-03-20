-- ============================================================================
-- Nixon López — Panel de administración (Supabase)
-- Ejecutar en: SQL Editor de Supabase o `supabase db push`
-- ============================================================================

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums (escalables: agregar valores con ALTER TYPE ... ADD VALUE)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.quote_status AS ENUM (
    'new',
    'reviewing',
    'accepted',
    'rejected',
    'converted_to_project',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.quote_source AS ENUM ('website', 'admin_manual', 'import');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.project_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.project_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.invoice_kind AS ENUM ('prefactura', 'final');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM (
    'draft',
    'sent',
    'partially_paid',
    'paid',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- Perfiles (opcional: extiende auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- Cotizaciones (desde web + creadas en panel)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  status public.quote_status NOT NULL DEFAULT 'new',
  source public.quote_source NOT NULL DEFAULT 'website',

  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  company TEXT,

  service_id TEXT,
  service_label TEXT,
  quantity_pages INTEGER,
  includes_domain_hosting_email BOOLEAN,
  payment_gateway_included BOOLEAN,

  subtotal NUMERIC(14, 2),
  extras_total NUMERIC(14, 2),
  discount_amount NUMERIC(14, 2) DEFAULT 0,
  tax_percent NUMERIC(6, 3),
  tax_amount NUMERIC(14, 2),
  total_amount NUMERIC(14, 2),
  currency TEXT NOT NULL DEFAULT 'USD',

  comments TEXT,
  internal_notes TEXT,
  raw_payload JSONB,

  converted_project_id UUID,
  email_notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes (status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON public.quotes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_client_email ON public.quotes (client_email);

-- ----------------------------------------------------------------------------
-- Proyectos (seguimiento: pendiente / en proceso / completado)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  quote_id UUID REFERENCES public.quotes (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,

  status public.project_status NOT NULL DEFAULT 'pending',
  priority public.project_priority NOT NULL DEFAULT 'normal',

  due_date DATE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  description TEXT,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_quote ON public.projects (quote_id);

ALTER TABLE public.quotes
  DROP CONSTRAINT IF EXISTS fk_quotes_converted_project;
ALTER TABLE public.quotes
  ADD CONSTRAINT fk_quotes_converted_project
  FOREIGN KEY (converted_project_id) REFERENCES public.projects (id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- Facturas + líneas (prefactura/abono vs factura final)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  invoice_number TEXT NOT NULL UNIQUE,
  invoice_kind public.invoice_kind NOT NULL,
  invoice_status public.invoice_status NOT NULL DEFAULT 'draft',

  -- prefactura con abono parcial
  is_abono BOOLEAN NOT NULL DEFAULT false,
  abono_amount NUMERIC(14, 2),

  quote_id UUID REFERENCES public.quotes (id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects (id) ON DELETE SET NULL,

  client_name TEXT NOT NULL,
  client_email TEXT,
  client_tax_id TEXT,
  client_address TEXT,

  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(6, 3) DEFAULT 0,
  tax_amount NUMERIC(14, 2) DEFAULT 0,
  discount_amount NUMERIC(14, 2) DEFAULT 0,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(14, 2) DEFAULT 0,
  balance_due NUMERIC(14, 2) GENERATED ALWAYS AS (total_amount - COALESCE(amount_paid, 0)) STORED,

  currency TEXT NOT NULL DEFAULT 'USD',

  issued_at DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_at TIMESTAMPTZ,

  notes TEXT,
  terms TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  quantity NUMERIC(14, 4) NOT NULL DEFAULT 1,
  unit_price NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice ON public.invoice_line_items (invoice_id);

-- Secuencia legible para números de factura (año-mes)
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq;

-- ----------------------------------------------------------------------------
-- Auditoría (escalable)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_log (created_at DESC);

-- ----------------------------------------------------------------------------
-- Triggers updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated ON public.profiles;
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_quotes_updated ON public.quotes;
CREATE TRIGGER tr_quotes_updated BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_projects_updated ON public.projects;
CREATE TRIGGER tr_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_invoices_updated ON public.invoices;
CREATE TRIGGER tr_invoices_updated BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Función: siguiente número de factura INV-YYYYMM-####
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  n BIGINT;
BEGIN
  prefix := 'INV-' || to_char(now() AT TIME ZONE 'utc', 'YYYYMM') || '-';
  SELECT nextval('public.invoice_number_seq') INTO n;
  RETURN prefix || lpad(n::text, 5, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO service_role;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Solo administrador (email fijo). Cambia el correo si usas otro.
-- Recomendado: definir en Supabase un secret y leerlo con vault; aquí usamos política explícita.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    auth.jwt() ->> 'email',
    ''
  ) = 'info@nixonlopez.com';
$$;

-- profiles: el usuario ve/edita su fila; admin ve todo (opcional)
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Tablas admin: solo is_admin()
CREATE POLICY "quotes_admin_all" ON public.quotes FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "projects_admin_all" ON public.projects FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "invoices_admin_all" ON public.invoices FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "invoice_lines_admin_all" ON public.invoice_line_items FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "audit_admin_select" ON public.audit_log FOR SELECT
  USING (public.is_admin());

CREATE POLICY "audit_admin_insert" ON public.audit_log FOR INSERT
  WITH CHECK (public.is_admin());

-- Inserción pública de cotizaciones desde API (service role) no usa RLS.
-- Si quisieras insert anon, añade política separada (no recomendado sin validación).

-- ----------------------------------------------------------------------------
-- Realtime (opcional): habilitar para tablas que quieras escuchar en el panel
-- ----------------------------------------------------------------------------
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.quotes;

COMMENT ON TABLE public.quotes IS 'Cotizaciones del sitio y del panel';
COMMENT ON TABLE public.projects IS 'Seguimiento de proyectos vinculado opcionalmente a cotización';
COMMENT ON TABLE public.invoices IS 'Prefactura (con abono) o factura final';

-- Perfil automático al registrarse en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
