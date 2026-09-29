import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, LayoutDashboard, ListChecks, Files, Zap, ScrollText, Settings2, CreditCard, CircleHelp, RefreshCw, Download, Eye, Plus, Search, Menu, Languages, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { localeNames, translate, type Locale, type MessageKey } from '@/i18n/messages';
import '@/styles/globals.css';

type Section = 'overview' | 'forms' | 'submissions' | 'templates' | 'automations' | 'logs' | 'settings' | 'billing' | 'help';
type Item = Record<string, any>;
type Overview = { context: { installed: boolean; locale: string }; plan: string; forms: Item[]; recentSubmissions: Item[]; formSettings: Item[]; templates: Item[]; pdfRecords: Item[]; exportJobs: Item[]; logs: Item[]; actions: Item[]; usage: number; settings: Item | null };

const navigation: { id: Section; icon: typeof FileText }[] = [
  { id: 'overview', icon: LayoutDashboard }, { id: 'forms', icon: FileText }, { id: 'submissions', icon: ListChecks },
  { id: 'templates', icon: Files }, { id: 'automations', icon: Zap }, { id: 'logs', icon: ScrollText },
  { id: 'settings', icon: Settings2 }, { id: 'billing', icon: CreditCard }, { id: 'help', icon: CircleHelp },
];

async function api<T>(op: string, data?: Record<string, unknown>): Promise<T> {
  const response = await fetch(data ? '/api/forms-pdf' : `/api/forms-pdf?op=${op}`, {
    method: data ? 'POST' : 'GET', credentials: 'same-origin',
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify({ op, ...data }) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'UNKNOWN');
  return result as T;
}

function getLocale(value: unknown): Locale {
  const code = typeof value === 'string' ? value : '';
  if (code in localeNames) return code as Locale;
  const base = code.split('-')[0];
  return base in localeNames ? base as Locale : 'en';
}

function date(value: unknown, locale: Locale) {
  if (!value) return '—';
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}

export default function DashboardPage() {
  const [section, setSection] = useState<Section>('overview');
  const [locale, setLocale] = useState<Locale>(getLocale(typeof navigator !== 'undefined' ? navigator.language : 'en'));
  const [overview, setOverview] = useState<Overview | null>(null);
  const [submissions, setSubmissions] = useState<Item[]>([]);
  const [detail, setDetail] = useState<Item | null>(null);
  const [search, setSearch] = useState('');
  const [formFilter, setFormFilter] = useState('all');
  const [templateDraft, setTemplateDraft] = useState<Item>({});
  const [deliveryDrafts, setDeliveryDrafts] = useState<Record<string, Item>>({});
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<{ title: string; label: MessageKey; action: () => Promise<unknown> } | null>(null);
  const [billingStatus, setBillingStatus] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useCallback((key: MessageKey) => translate(locale, key), [locale]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await api<Overview>('overview');
      setOverview(result);
      setSubmissions(result.recentSubmissions ?? []);
      setLocale(getLocale(result.settings?.locale ?? result.context.locale));
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);

  const refreshSubmissions = useCallback(async (formId = formFilter) => {
    try {
      const params = formId === 'all' ? '' : `&formId=${encodeURIComponent(formId)}`;
      const response = await fetch(`/api/forms-pdf?op=submissions${params}`, { credentials: 'same-origin' });
      if (!response.ok) throw new Error();
      const result = await response.json();
      setSubmissions(result.submissions ?? []);
    } catch { toast.error(t('errorGeneric')); }
  }, [formFilter, t]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { if (section === 'submissions') void refreshSubmissions(); }, [section, refreshSubmissions]);
  useEffect(() => { if (section === 'billing') void api<Item>('billing').then(setBillingStatus).catch(() => setBillingStatus(null)); }, [section]);
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'; }, [locale]);

  const run = async (action: () => Promise<unknown>, success: MessageKey = 'saved') => {
    setBusy(true);
    try { await action(); toast.success(t(success)); await refresh(); }
    catch { toast.error(t('errorGeneric')); }
    finally { setBusy(false); }
  };

  const changeLocale = async (value: Locale) => {
    setLocale(value);
    try { await api('locale', { locale: value }); toast.success(translate(value, 'saved')); }
    catch { toast.error(translate(value, 'errorGeneric')); }
  };

  const openSubmission = async (id: string) => {
    setBusy(true);
    try { setDetail(await api<Item>(`submission&id=${encodeURIComponent(id)}`)); }
    catch { toast.error(t('errorGeneric')); }
    finally { setBusy(false); }
  };

  const generate = (id: string) => run(async () => { await api('generate', { submissionId: id }); }, 'generated');
  const download = async (id: string, inline = false) => {
    try {
      const result = await api<{ url: string }>(`download&id=${encodeURIComponent(id)}&inline=${inline ? 1 : 0}`);
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch { toast.error(t('errorGeneric')); }
  };

  const createZip = async () => {
    setBusy(true);
    try {
      const job = await api<Item>('zip', { recordIds: selectedRecords });
      let status = job.status;
      for (let attempt = 0; status !== 'ready' && status !== 'failed' && attempt < 10; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        status = (await api<Item>(`zip-status&id=${encodeURIComponent(job._id)}`)).status;
      }
      if (status === 'failed') throw new Error('ZIP_FAILED');
      if (status === 'ready') {
        const result = await api<{ url: string }>(`zip-download&id=${encodeURIComponent(job._id)}`);
        window.open(result.url, '_blank', 'noopener,noreferrer');
      }
      setSelectedRecords([]);
      toast.success(t('saved'));
      await refresh();
    } catch { toast.error(t('errorGeneric')); }
    finally { setBusy(false); }
  };
  const checkout = async (plan: 'pro' | 'business') => {
    try {
      const result = await api<{ url: string }>('checkout', { plan });
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch { toast.error(t('billingUnavailable')); }
  };

  const activeForms = overview?.forms ?? [];
  const filteredSubmissions = useMemo(() => submissions.filter((item) => {
    const q = search.toLocaleLowerCase(locale);
    return !q || String(item._id ?? item.id ?? '').toLocaleLowerCase(locale).includes(q) || JSON.stringify(item.submissions ?? {}).toLocaleLowerCase(locale).includes(q);
  }), [submissions, search, locale]);
  const settingsFor = (formId: string) => overview?.formSettings.find((item) => item.formId === formId);
  const deliveryFor = (formId: string) => ({ ...(settingsFor(formId)?.delivery ?? {}), ...(deliveryDrafts[formId] ?? {}) });
  const setDeliveryField = (formId: string, field: string, value: unknown) => setDeliveryDrafts((current) => ({ ...current, [formId]: { ...(current[formId] ?? {}), [field]: value } }));
  const renderNav = () => <nav aria-label={t('appName')} className="grid gap-1">{navigation.map(({ id, icon: Icon }) => <Button key={id} variant={section === id ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => { setSection(id); setMenuOpen(false); }}><Icon className="size-4" aria-hidden="true" />{t(id)}</Button>)}</nav>;
  const pageTitle = t(section);

  return <div className="min-h-screen bg-background text-foreground">
    <Toaster richColors position="bottom-right" />
    <div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-60 shrink-0 border-r bg-card px-4 py-6 lg:block"><div className="mb-8 flex items-center gap-2 px-3 text-lg font-semibold"><FileText className="size-6 text-primary" />{t('appName')}</div>{renderNav()}</aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><Button className="lg:hidden" variant="outline" size="icon" aria-label={t('open')}><Menu className="size-4" /></Button></SheetTrigger><SheetContent side={locale === 'ar' || locale === 'he' ? 'right' : 'left'} className="w-64 p-5"><div className="mb-7 text-lg font-semibold">{t('appName')}</div>{renderNav()}</SheetContent></Sheet>
            <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('appName')}</p><h1 className="truncate text-xl font-semibold sm:text-2xl">{pageTitle}</h1></div>
          </div>
          <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => void refresh()} aria-label={t('refresh')}><RefreshCw className="size-4" /></Button><Select value={locale} onValueChange={(value) => void changeLocale(value as Locale)}><SelectTrigger aria-label={t('language')} className="w-35"><Languages className="size-4" /><SelectValue /></SelectTrigger><SelectContent>{Object.entries(localeNames).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent></Select></div>
        </header>
        <main className="space-y-6 p-4 sm:p-8">
          {loading && !overview ? <p role="status" className="text-muted-foreground">{t('loading')}…</p> : null}
          {error ? <Card><CardHeader><CardTitle>{t('errorGeneric')}</CardTitle></CardHeader><CardContent><Button onClick={() => void refresh()}>{t('retry')}</Button></CardContent></Card> : null}
          {overview && !overview.context.installed ? <Card className="border-amber-300 bg-amber-50"><CardHeader><CardTitle>{t('formsRequired')}</CardTitle><CardDescription>{t('formsRequiredHint')}</CardDescription></CardHeader><CardContent><Button onClick={() => void refresh()}><RefreshCw className="mr-2 size-4" />{t('refresh')}</Button></CardContent></Card> : null}
          {overview && section === 'overview' ? <>
            <Card className="overflow-hidden border-primary/15 bg-gradient-to-r from-slate-900 to-blue-950 text-white"><CardHeader><CardTitle className="text-2xl">{t('getStarted')}</CardTitle><CardDescription className="text-blue-100">{t('onboardingHint')}</CardDescription></CardHeader><CardContent><div className="mb-3 flex justify-between text-sm"><span>{t('setupProgress')}</span><span>{[activeForms.length > 0, overview.templates.length > 0, overview.formSettings.some((item) => item.automatic)].filter(Boolean).length}/3</span></div><Progress value={100 * [activeForms.length > 0, overview.templates.length > 0, overview.formSettings.some((item) => item.automatic)].filter(Boolean).length / 3} className="bg-white/20" /><div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setSection('forms')}>{t('selectForm')}<ChevronRight className="ml-1 size-4" /></Button><Button variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => setSection('templates')}>{t('chooseTemplate')}</Button></div></CardContent></Card>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{([['forms', activeForms.length], ['recentSubmissions', submissions.length], ['generatedPdfs', overview.pdfRecords.filter((item) => item.status === 'ready').length], ['usageThisMonth', overview.usage]] as [MessageKey, number][]).map(([key, value]) => <Card key={key}><CardHeader className="pb-1"><CardDescription>{t(key)}</CardDescription></CardHeader><CardContent className="text-3xl font-semibold">{new Intl.NumberFormat(locale).format(value)}</CardContent></Card>)}</div>
            <Card><CardHeader><CardTitle>{t('quickActions')}</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Button onClick={() => setSection('submissions')}>{t('submissions')}</Button><Button variant="outline" onClick={() => setSection('templates')}>{t('createTemplate')}</Button><Button variant="outline" onClick={() => setSection('automations')}>{t('configureDelivery')}</Button></CardContent></Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4"><CardTitle>{t('recentPdfs')}</CardTitle><Button disabled={busy || (overview.plan !== 'free' && (!selectedRecords.length || selectedRecords.length > 5))} onClick={() => overview.plan === 'free' ? setSection('billing') : void createZip()}>{overview.plan === 'free' ? t('upgrade') : t('downloadZip')}</Button></CardHeader>
              <CardContent className="space-y-2">{overview.pdfRecords.filter((record) => record.status === 'ready').length ? overview.pdfRecords.filter((record) => record.status === 'ready').slice(0, 10).map((record) => <div key={record._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div className="flex min-w-0 items-center gap-3"><Checkbox aria-label={`${t('select')}: ${record.submissionId}`} checked={selectedRecords.includes(record._id)} onCheckedChange={(checked) => setSelectedRecords((current) => checked ? [...current, record._id] : current.filter((id) => id !== record._id))} /><div><p className="truncate font-medium">{record.submissionId}</p><p className="text-sm text-muted-foreground">{date(record.createdAt, locale)}</p></div></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void download(record._id, true)}>{t('preview')}</Button><Button size="sm" onClick={() => void download(record._id)}>{t('download')}</Button></div></div>) : <p className="text-muted-foreground">{t('noPdfs')}</p>}</CardContent>
            </Card>
            {overview.exportJobs?.length ? <Card><CardHeader><CardTitle>{t('downloadZip')}</CardTitle></CardHeader><CardContent className="space-y-2">{overview.exportJobs.slice(-10).reverse().map((job) => <div key={job._id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div><p className="text-sm">{date(job.createdAt, locale)}</p><Badge variant={job.status === 'failed' ? 'destructive' : 'secondary'}>{t(job.status === 'ready' ? 'complete' : job.status === 'failed' ? 'errorGeneric' : 'loading')}</Badge></div><Button variant="outline" size="sm" disabled={job.status !== 'ready'} onClick={async () => { try { const result = await api<{ url: string }>(`zip-download&id=${encodeURIComponent(job._id)}`); window.open(result.url, '_blank', 'noopener,noreferrer'); } catch { toast.error(t('errorGeneric')); } }}>{t('download')}</Button></div>)}</CardContent></Card> : null}
          </> : null}
          {overview && section === 'forms' ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{activeForms.length ? activeForms.map((form) => <Card key={form._id}><CardHeader><CardTitle className="truncate">{form.name || form._id}</CardTitle><CardDescription>{form._id}</CardDescription></CardHeader><CardContent className="flex items-center justify-between gap-3"><Badge variant={settingsFor(form._id)?.automatic ? 'default' : 'secondary'}>{t(settingsFor(form._id)?.automatic ? 'enabled' : 'disabled')}</Badge><Button variant="outline" onClick={() => { setFormFilter(form._id); setSection('submissions'); }}>{t('view')}</Button></CardContent></Card>) : <Card><CardContent className="pt-6 text-muted-foreground">{t('noForms')}</CardContent></Card>}</div> : null}
          {overview && section === 'submissions' ? <Card><CardHeader><CardTitle>{t('submissions')}</CardTitle><div className="flex flex-col gap-3 pt-2 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input aria-label={t('search')} placeholder={t('search')} className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Select value={formFilter} onValueChange={(value) => { setFormFilter(value); void refreshSubmissions(value); }}><SelectTrigger aria-label={t('form')} className="sm:w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{t('forms')}</SelectItem>{activeForms.map((form) => <SelectItem value={form._id} key={form._id}>{form.name || form._id}</SelectItem>)}</SelectContent></Select></div></CardHeader><CardContent><div className="space-y-2">{filteredSubmissions.length ? filteredSubmissions.map((item) => <div key={item._id ?? item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><p className="truncate font-medium">{item._id ?? item.id}</p><p className="text-sm text-muted-foreground">{date(item._createdDate, locale)}</p></div><div className="flex gap-2"><Badge variant="outline">{item.status}</Badge><Button variant="outline" size="sm" onClick={() => void openSubmission(item._id ?? item.id)}><Eye className="mr-1 size-4" />{t('view')}</Button><Button size="sm" disabled={busy || item.status !== 'CONFIRMED'} onClick={() => void generate(item._id ?? item.id)}>{t('generate')}</Button></div></div>) : <p className="py-6 text-center text-muted-foreground">{t('noSubmissions')}</p>}</div></CardContent></Card> : null}
          {overview && section === 'templates' ? <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
            <Card><CardHeader><CardTitle>{t('templates')}</CardTitle></CardHeader><CardContent className="space-y-2">{overview.templates.length ? overview.templates.map((template) => <div key={template._id} className="rounded-lg border p-3"><div className="mb-3 flex items-center justify-between gap-2"><span className="font-medium">{template.name}</span><Badge variant="secondary">{template.version}</Badge></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setTemplateDraft({ ...(template.config ?? {}), id: template._id })}>{t('editTemplate')}</Button><Button variant="outline" size="sm" onClick={() => void run(() => api('template-duplicate', { templateId: template._id, name: `${template.name} (${t('duplicate')})` }))}>{t('duplicate')}</Button><Button variant="outline" size="sm" onClick={() => setConfirmation({ title: t('setDefault'), label: 'setDefault', action: () => api('template-default', { templateId: template._id }) })}>{t('setDefault')}</Button><Button variant="destructive" size="sm" onClick={() => setConfirmation({ title: t('confirmDelete'), label: 'delete', action: () => api('template-delete', { templateId: template._id, confirmed: true }) })}>{t('delete')}</Button></div></div>) : <p className="text-muted-foreground">{t('noTemplates')}</p>}</CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t(templateDraft.id ? 'editTemplate' : 'createTemplate')}</CardTitle><Button size="sm" variant="outline" onClick={() => setTemplateDraft({})}><Plus className="mr-1 size-4" />{t('createTemplate')}</Button></CardHeader><CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="template-name">{t('templateName')}</Label><Input id="template-name" value={templateDraft.name ?? ''} onChange={(event) => setTemplateDraft((current) => ({ ...current, name: event.target.value }))} /></div>
              {(['title', 'subtitle', 'footer'] as const).map((field) => <div className="space-y-2" key={field}><Label htmlFor={`template-${field}`}>{t(field)}</Label><Textarea id={`template-${field}`} value={templateDraft[field] ?? ''} onChange={(event) => setTemplateDraft((current) => ({ ...current, [field]: event.target.value }))} /></div>)}
              <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>{t('pageSize')}</Label><Select value={templateDraft.pageSize ?? 'A4'} onValueChange={(pageSize) => setTemplateDraft((current) => ({ ...current, pageSize }))}><SelectTrigger aria-label={t('pageSize')}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="A4">{t('a4')}</SelectItem><SelectItem value="LETTER">{t('usLetter')}</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>{t('imageColumns')}</Label><Select value={String(templateDraft.imageColumns ?? 1)} onValueChange={(imageColumns) => setTemplateDraft((current) => ({ ...current, imageColumns: Number(imageColumns) }))}><SelectTrigger aria-label={t('imageColumns')}><SelectValue /></SelectTrigger><SelectContent>{[1, 2, 3].map((value) => <SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select></div></div>
              <div className="flex items-center justify-between"><Label htmlFor="hide-empty">{t('hideEmpty')}</Label><Switch id="hide-empty" checked={Boolean(templateDraft.hideEmpty)} onCheckedChange={(hideEmpty) => setTemplateDraft((current) => ({ ...current, hideEmpty }))} /></div>
              <Button disabled={busy || !String(templateDraft.name ?? '').trim()} onClick={() => void run(async () => { await api('template', { template: templateDraft }); setTemplateDraft({}); })}>{t('save')}</Button>
            </CardContent></Card>
          </div> : null}
          {overview && section === 'automations' ? <Card><CardHeader><CardTitle>{t('automaticPdfs')}</CardTitle><CardDescription>{t('configureDelivery')}</CardDescription></CardHeader><CardContent className="space-y-4">{activeForms.length ? activeForms.map((form) => {
            const setting = settingsFor(form._id);
            const delivery = deliveryFor(form._id);
            return <div key={form._id} className="space-y-4 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-medium">{form.name || form._id}</p><p className="text-sm text-muted-foreground">{t(setting?.automatic ? 'enabled' : 'disabled')}</p></div><div className="flex items-center gap-3"><Select value={setting?.templateId || 'starter-minimal'} onValueChange={(templateId) => void run(() => api('form', { formId: form._id, settings: { templateId } }))}><SelectTrigger aria-label={t('chooseTemplate')} className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="starter-minimal">{t('starterMinimal')}</SelectItem>{overview.templates.map((template) => <SelectItem key={template._id} value={template._id}>{template.name}</SelectItem>)}</SelectContent></Select><Switch aria-label={`${t('automaticPdfs')}: ${form.name || form._id}`} checked={Boolean(setting?.automatic)} disabled={busy || overview.plan === 'free'} onCheckedChange={(automatic) => setConfirmation({ title: `${t('automaticPdfs')}: ${form.name || form._id}`, label: automatic ? 'enabled' : 'disabled', action: () => api('form', { formId: form._id, settings: { automatic }, confirmed: true }) })} /></div></div>
              {overview.plan !== 'free' ? <div className="space-y-3 border-t pt-4"><p className="text-sm font-medium">{t('configureDelivery')}</p><div className="grid gap-3 sm:grid-cols-2"><div className="flex items-center justify-between gap-2"><Label htmlFor={`owner-${form._id}`}>{t('emailOwner')}</Label><Switch id={`owner-${form._id}`} checked={Boolean(delivery.emailOwner)} onCheckedChange={(value) => setDeliveryField(form._id, 'emailOwner', value)} /></div><div className="flex items-center justify-between gap-2"><Label htmlFor={`submitter-${form._id}`}>{t('emailSubmitter')}</Label><Switch id={`submitter-${form._id}`} checked={Boolean(delivery.emailSubmitter)} onCheckedChange={(value) => setDeliveryField(form._id, 'emailSubmitter', value)} /></div></div><div className="space-y-2"><Label htmlFor={`recipients-${form._id}`}>{t('customRecipients')}</Label><Input id={`recipients-${form._id}`} value={typeof delivery.recipients === 'string' ? delivery.recipients : (delivery.recipients ?? []).join(', ')} onChange={(event) => setDeliveryField(form._id, 'recipients', event.target.value)} /></div>{overview.plan === 'business' ? <div className="space-y-2"><Label htmlFor={`webhook-${form._id}`}>{t('webhookUrl')}</Label><Input id={`webhook-${form._id}`} type="url" value={delivery.webhookUrl ?? ''} onChange={(event) => setDeliveryField(form._id, 'webhookUrl', event.target.value)} /></div> : null}<Button variant="outline" disabled={busy} onClick={() => setConfirmation({ title: t('configureDelivery'), label: 'save', action: () => api('form', { formId: form._id, confirmed: true, settings: { delivery: { emailOwner: Boolean(delivery.emailOwner), emailSubmitter: Boolean(delivery.emailSubmitter), recipients: (typeof delivery.recipients === 'string' ? delivery.recipients.split(',') : delivery.recipients ?? []).map((item: string) => item.trim()).filter(Boolean), webhookUrl: overview.plan === 'business' ? delivery.webhookUrl || undefined : undefined } } }) })}>{t('save')}</Button></div> : <Button variant="outline" onClick={() => setSection('billing')}>{t('upgrade')}</Button>}
            </div>;
          }) : <p className="text-muted-foreground">{t('noForms')}</p>}</CardContent></Card> : null}
          {overview && section === 'logs' ? <Card><CardHeader><CardTitle>{t('logs')}</CardTitle></CardHeader><CardContent className="space-y-2">{overview.logs.length || overview.actions.length ? [...overview.logs, ...overview.actions].map((log) => <div key={log._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"><div><p className="font-medium">{log.actionType || log.eventType} · {log.submissionId}</p><p className="text-sm text-muted-foreground">{date(log.receivedAt || log.lastAttemptAt, locale)}</p></div><div className="flex items-center gap-2"><Badge variant={log.status === 'failed' ? 'destructive' : 'secondary'}>{t(log.status === 'completed' ? 'complete' : log.status === 'failed' ? 'errorGeneric' : 'loading')}</Badge>{log.status === 'failed' ? <Button variant="outline" size="sm" onClick={() => setConfirmation({ title: t('retry'), label: 'retry', action: () => api('retry', { kind: log.actionType ? 'action' : 'event', id: log._id, confirmed: true }) })}>{t('retry')}</Button> : null}</div></div>) : <p className="text-muted-foreground">{t('noLogs')}</p>}</CardContent></Card> : null}
          {overview && section === 'settings' ? <Card className="max-w-xl"><CardHeader><CardTitle>{t('settings')}</CardTitle></CardHeader><CardContent className="space-y-3"><Label htmlFor="locale-select">{t('language')}</Label><Select value={locale} onValueChange={(value) => void changeLocale(value as Locale)}><SelectTrigger id="locale-select"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(localeNames).map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent></Select><Separator /><p className="text-sm text-muted-foreground">{t('usageThisMonth')}: {new Intl.NumberFormat(locale).format(overview.usage)}</p></CardContent></Card> : null}
          {overview && section === 'billing' ? <Card className="max-w-xl"><CardHeader><CardTitle>{t('billing')}</CardTitle></CardHeader><CardContent className="space-y-4"><p>{t('currentPlan')}: <Badge variant="secondary">{overview.plan}</Badge></p><p>{t('usageThisMonth')}: {new Intl.NumberFormat(locale).format(billingStatus?.usage ?? overview.usage)} / {new Intl.NumberFormat(locale).format(billingStatus?.monthlyLimit ?? 25)}</p><div className="flex flex-wrap gap-2"><Button disabled={!billingStatus?.proAvailable} onClick={() => void checkout('pro')}>{t('upgrade')} {t('proPlan')}</Button><Button variant="outline" disabled={!billingStatus?.businessAvailable} onClick={() => void checkout('business')}>{t('upgrade')} {t('businessPlan')}</Button></div>{!billingStatus?.proAvailable && !billingStatus?.businessAvailable ? <p className="text-sm text-muted-foreground">{t('billingUnavailable')}</p> : null}</CardContent></Card> : null}
          {overview && section === 'help' ? <Card className="max-w-xl"><CardHeader><CardTitle>{t('help')}</CardTitle><CardDescription>{t('onboardingHint')}</CardDescription></CardHeader><CardContent className="space-y-3">{(['verifyForms','selectForm','chooseTemplate','testPdf','enableAutomatic'] as MessageKey[]).map((key, index) => <div key={key} className="flex gap-3 rounded-lg border p-3"><Badge variant="outline">{index + 1}</Badge><span>{t(key)}</span></div>)}</CardContent></Card> : null}
        </main>
      </div>
    </div>
    <Dialog open={Boolean(confirmation)} onOpenChange={(open) => { if (!open) setConfirmation(null); }}><DialogContent><DialogHeader><DialogTitle>{confirmation?.title}</DialogTitle></DialogHeader><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmation(null)}>{t('cancel')}</Button><Button disabled={busy} onClick={() => { const action = confirmation?.action; setConfirmation(null); if (action) void run(action); }}>{confirmation ? t(confirmation.label) : null}</Button></div></DialogContent></Dialog>
    <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{t('details')}</DialogTitle></DialogHeader>{detail ? <div className="space-y-4"><p className="text-sm text-muted-foreground">{detail.submission?._id}</p>{(detail.answers ?? []).map((answer: Item) => <div key={answer.target} className="rounded-lg border p-3"><p className="mb-1 font-medium">{answer.label}</p>{answer.kind === 'text' ? <p className="whitespace-pre-wrap text-sm">{answer.text || '—'}</p> : <div className="grid gap-2 sm:grid-cols-2">{(answer.files ?? []).map((file: Item) => <div key={file.reference} className="text-sm">{file.previewUrl && (answer.kind === 'image' || answer.kind === 'signature') ? <img src={file.previewUrl} alt={answer.label} className="mb-2 max-h-56 w-full rounded border object-contain" loading="lazy" /> : null}{file.name}</div>)}</div>}</div>)}{(detail.records ?? []).filter((record: Item) => record.status === 'ready').map((record: Item) => <div key={record._id} className="flex gap-2"><Button variant="outline" onClick={() => void download(record._id, true)}><Eye className="mr-2 size-4" />{t('preview')}</Button><Button onClick={() => void download(record._id)}><Download className="mr-2 size-4" />{t('download')}</Button></div>)}</div> : null}</DialogContent></Dialog>
  </div>;
}
