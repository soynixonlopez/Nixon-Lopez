/** Clases compartidas del panel admin — tema claro alineado con la web pública */
export const adminUi = {
  shellBg: 'bg-slate-50',
  sidebar: 'border-r border-slate-200 bg-white shadow-[2px_0_24px_rgba(15,23,42,0.04)]',
  sidebarHeader: 'border-b border-slate-200',
  navActive: 'bg-brand text-white shadow-sm',
  navIdle: 'text-slate-600 hover:bg-slate-100 hover:text-brand',
  headerMobile: 'border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm',
  pageTitle: 'text-2xl font-bold text-slate-900 md:text-3xl',
  pageSubtitle: 'mt-1 text-slate-600',
  card: 'rounded-2xl border border-slate-200/80 bg-white shadow-sm',
  cardHover:
    'transition-all duration-200 hover:border-brand/25 hover:shadow-md hover:shadow-brand/5',
  panel: 'rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm',
  statIcon: 'text-brand',
  link: 'text-brand transition-colors hover:text-brand-light hover:underline',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-light disabled:opacity-50',
  btnPrimaryLg:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-light disabled:opacity-50',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50',
  btnGradient:
    'bg-gradient-to-r from-brand via-brand-light to-neon-purple text-white font-semibold transition hover:opacity-95 disabled:opacity-50',
  btnOutline:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-brand/25 px-3 py-2 text-sm text-brand transition hover:bg-brand/5',
  input:
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15',
  inputWithIcon: 'pl-10 pr-3 py-2.5',
  select:
    'rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 shadow-sm',
  tableWrap: 'admin-table-scroll overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm',
  tableHead:
    'border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
  tableRow: 'border-b border-slate-100 transition-colors hover:bg-slate-50',
  mobileCard: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
  fab: 'bg-gradient-to-r from-brand to-neon-purple text-white shadow-lg shadow-brand/25 transition-transform hover:scale-105',
  badge:
    'inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand',
  loginPage: 'bg-slate-50',
  loginBadge:
    'inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand',
  loginInput:
    'w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15',
  loginCard:
    'relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-10',
  loginBtn:
    'w-full rounded-full bg-gradient-to-r from-brand via-brand-light to-neon-purple py-3.5 text-base font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105 disabled:opacity-50',
  modal: 'w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl',
  dropdown: 'overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-brand/30',
} as const
