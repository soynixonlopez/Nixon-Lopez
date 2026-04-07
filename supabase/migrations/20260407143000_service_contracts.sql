-- ============================================================================
-- Contratos de servicios tecnológicos
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.contract_status AS ENUM (
    'draft',
    'sent',
    'signed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  contract_number TEXT NOT NULL UNIQUE,
  status public.contract_status NOT NULL DEFAULT 'draft',

  quote_id UUID REFERENCES public.quotes (id) ON DELETE SET NULL,

  client_name TEXT NOT NULL,
  client_email TEXT,
  client_tax_id TEXT,
  client_address TEXT,
  city TEXT,

  service_type TEXT,
  service_label TEXT NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',

  signed_date DATE,
  custom_notes TEXT,
  terms_payload JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_service_contracts_created ON public.service_contracts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_contracts_status ON public.service_contracts (status);
CREATE INDEX IF NOT EXISTS idx_service_contracts_quote ON public.service_contracts (quote_id);

CREATE SEQUENCE IF NOT EXISTS public.contract_number_seq;

CREATE OR REPLACE FUNCTION public.next_contract_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  n BIGINT;
BEGIN
  prefix := 'CTR-' || to_char(now() AT TIME ZONE 'utc', 'YYYYMM') || '-';
  SELECT nextval('public.contract_number_seq') INTO n;
  RETURN prefix || lpad(n::text, 5, '0');
END;
$$ LANGUAGE plpgsql VOLATILE;

GRANT EXECUTE ON FUNCTION public.next_contract_number() TO authenticated;
GRANT EXECUTE ON FUNCTION public.next_contract_number() TO service_role;

ALTER TABLE public.service_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_contracts_admin_all" ON public.service_contracts FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS tr_service_contracts_updated ON public.service_contracts;
CREATE TRIGGER tr_service_contracts_updated BEFORE UPDATE ON public.service_contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
