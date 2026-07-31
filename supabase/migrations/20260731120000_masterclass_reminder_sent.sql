ALTER TABLE public.masterclass_registrations
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS masterclass_registrations_reminder_sent_at_idx
  ON public.masterclass_registrations (reminder_sent_at)
  WHERE reminder_sent_at IS NOT NULL;
