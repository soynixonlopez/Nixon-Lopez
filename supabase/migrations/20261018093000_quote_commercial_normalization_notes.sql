-- Normalización comercial de cotizaciones (runtime, no backfill automático)
-- El bloque raw_payload.commercial y commercial_contract_meta se generan al crear contratos
-- desde el panel admin. Los contratos ya emitidos conservan terms_payload congelado.
-- No modificar raw_payload de cotizaciones históricas en esta migración.

COMMENT ON COLUMN public.quotes.raw_payload IS
  'JSON de cotización. Incluye configurator, breakdown.lines (fuente de precios aceptados), commercial (snapshot) y opcional commercial_contract_meta al preparar contratos.';
