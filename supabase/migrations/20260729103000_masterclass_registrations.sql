-- ============================================================================
-- Registros de masterclass (landing /masterclass)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.masterclass_registration_status AS ENUM (
    'registered',
    'confirmed',
    'attended',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.masterclass_registration_source AS ENUM ('website', 'admin_manual');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.masterclass_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,

  event_slug TEXT NOT NULL,
  event_name TEXT,

  status public.masterclass_registration_status NOT NULL DEFAULT 'registered',
  source public.masterclass_registration_source NOT NULL DEFAULT 'website',

  internal_notes TEXT,
  email_notified_at TIMESTAMPTZ,
  confirmation_sent_at TIMESTAMPTZ,

  CONSTRAINT masterclass_registrations_email_event_unique UNIQUE (email, event_slug)
);

CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_created
  ON public.masterclass_registrations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_event
  ON public.masterclass_registrations (event_slug);

CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_status
  ON public.masterclass_registrations (status);

CREATE INDEX IF NOT EXISTS idx_masterclass_registrations_email
  ON public.masterclass_registrations (email);

ALTER TABLE public.masterclass_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "masterclass_registrations_admin_all"
  ON public.masterclass_registrations
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

COMMENT ON TABLE public.masterclass_registrations IS 'Registros de masterclass desde la landing y el panel admin';
