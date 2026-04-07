-- ============================================================================
-- Proyecto Kanban tasks
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.project_task_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.project_task_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status public.project_task_status NOT NULL DEFAULT 'pending',
  priority public.project_task_priority NOT NULL DEFAULT 'normal',
  due_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project_status_sort
  ON public.project_tasks (project_id, status, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_priority
  ON public.project_tasks (project_id, priority);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_due
  ON public.project_tasks (project_id, due_date);

ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_tasks_admin_all" ON public.project_tasks FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS tr_project_tasks_updated ON public.project_tasks;
CREATE TRIGGER tr_project_tasks_updated BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
