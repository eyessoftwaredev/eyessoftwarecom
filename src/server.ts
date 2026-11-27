import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

// Load .env for local development; in production (Coolify) env vars are injected directly.
try {
  process.loadEnvFile();
} catch {
  // No .env file present.
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  website?: string; // honeypot: hidden from humans, bots fill it in
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const app = express();

app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// ── Pages in every language ──
// English lives at the bare path (/products); the others under a prefix (/tr/products) so a link opens
// in its language. The browser still translates in place from public/locales; the server only sets what
// crawlers and link previews read first: <html lang/dir>, <title>, description, canonical and hreflang.
const SITE = 'https://eyessoftware.com';
const LANGS = ['en', 'tr', 'ar', 'de', 'fr'] as const;
type Lang = (typeof LANGS)[number];
const PAGES: Record<string, string> = {
  '': 'index.html',
  products: 'products.html',
  terms: 'terms.html',
  'refund-policy': 'refund-policy.html',
  privacy: 'privacy.html',
  cookies: 'cookies.html',
};
const cacheFiles = process.env.NODE_ENV === 'production';
const fileCache = new Map<string, string>();

function readPublic(file: string): string {
  const hit = cacheFiles ? fileCache.get(file) : undefined;
  if (hit !== undefined) return hit;
  const text = fs.readFileSync(path.join(publicDir, file), 'utf8');
  if (cacheFiles) fileCache.set(file, text);
  return text;
}

function lookup(lang: Lang, key: string): string | null {
  const data = JSON.parse(readPublic(`locales/${lang}.json`)) as Record<string, unknown>;
  const value = key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), data);
  return typeof value === 'string' ? value : null;
}

function pageUrl(lang: Lang, slug: string): string {
  if (lang === 'en') return `${SITE}/${slug}`;
  return `${SITE}/${lang}/${slug}`;
}

function renderPage(lang: Lang, slug: string): string {
  let html = readPublic(PAGES[slug]);
  html = html.replace('<html lang="en">', `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`);
  html = html.replace(
    /<title data-i18n="([^"]+)"(?: data-i18n-suffix="([^"]*)")?>[^<]*<\/title>/,
    (whole, key: string, suffix?: string) => {
      const value = lookup(lang, key);
      return value ? whole.replace(/>[^<]*</, `>${escapeHtml(value + (suffix ?? ''))}<`) : whole;
    },
  );
  html = html.replace(/(<meta name="description" data-i18n-content="([^"]+)" content=")[^"]*"/, (whole, start: string, key: string) => {
    const value = lookup(lang, key);
    return value ? `${start}${escapeHtml(value)}"` : whole;
  });
  const links = [
    `<link rel="canonical" href="${pageUrl(lang, slug)}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l, slug)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('en', slug)}" />`,
  ].join('\n  ');
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
  return html.replace('<meta name="theme-color"', `${links}\n  <meta name="theme-color"`);
}

app.get(/^\/(?:(tr|ar|de|fr)(\/|$))?(products|terms|refund-policy|privacy|cookies)?(?:\.html)?\/?$/, (req: Request, res: Response) => {
  const lang = (req.params[0] as Lang | undefined) ?? 'en';
  const slug = req.params[2] ?? '';
  // /tr → /tr/ so every page has one address.
  if (lang !== 'en' && !slug && req.params[1] !== '/') {
    res.redirect(301, `/${lang}/`);
    return;
  }
  res.type('html').send(renderPage(lang, slug));
});

app.use(express.static(publicDir, { extensions: ['html'] }));

app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Email service not configured.' });
      return;
    }

    const { name, email, message, website } = req.body as ContactBody;

    if (website) {
      res.json({ success: true });
      return;
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({ error: 'Invalid email address.' });
      return;
    }

    if (trimmedName.length > 200 || trimmedEmail.length > 254 || trimmedMessage.length > 5000) {
      res.status(400).json({ error: 'Input too long.' });
      return;
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'EyesSoftware <form@eyessoftware.com>',
      to: ['dev@eyessoftware.com'],
      replyTo: trimmedEmail,
      subject: `New contact form submission — ${trimmedName}`,
      text: [
        'New message from the eyessoftware.com contact form.',
        '',
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        '',
        trimmedMessage,
      ].join('\n'),
      html: [
        '<p>New message from the eyessoftware.com contact form.</p>',
        `<p><strong>Name:</strong> ${escapeHtml(trimmedName)}<br>`,
        `<strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>`,
        '<hr>',
        `<p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>`,
      ].join(''),
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(502).json({ error: 'Failed to send email.' });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

interface QuoteBody {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  sector?: string;
  needs?: unknown;
  pages?: string;
  timeline?: string;
  budget?: string;
  note?: string;
  consent?: boolean;
  source?: string;
  website?: string; // honeypot
}

const clip = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Quote form on /tr/ (WhatsApp-first: phone required, email optional).
app.post('/api/quote', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Email service not configured.' });
      return;
    }
    const b = req.body as QuoteBody;
    if (b.website) {
      res.json({ success: true });
      return;
    }
    const name = clip(b.name, 200);
    const phone = clip(b.phone, 40);
    const email = clip(b.email, 254);
    if (!name || phone.replace(/\D/g, '').length < 10) {
      res.status(400).json({ error: 'Name and phone are required.' });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Invalid email address.' });
      return;
    }
    if (b.consent !== true) {
      res.status(400).json({ error: 'Consent is required.' });
      return;
    }
    const needs = Array.isArray(b.needs) ? b.needs.filter((x): x is string => typeof x === 'string').map(x => x.slice(0, 60)).slice(0, 10) : [];
    const sector = clip(b.sector, 60);
    const rows: [string, string][] = [
      ['Ad soyad', name],
      ['WhatsApp', phone],
      ['E-posta', email || '-'],
      ['Firma / marka', clip(b.company, 200) || '-'],
      ['Sektör', sector || '-'],
      ['İhtiyaç', needs.join(', ') || '-'],
      ['Sayfa sayısı', clip(b.pages, 40) || '-'],
      ['Zaman', clip(b.timeline, 60) || '-'],
      ['Bütçe', clip(b.budget, 60) || '-'],
      ['Kaynak', clip(b.source, 300) || '-'],
    ];
    const note = clip(b.note, 3000);
    const waLink = `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '90')}`;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'EyesSoftware <form@eyessoftware.com>',
      to: ['dev@eyessoftware.com'],
      ...(email ? { replyTo: email } : {}),
      subject: `Teklif talebi — ${name}${sector ? ` (${sector})` : ''}`,
      text: ['Yeni teklif talebi (eyessoftware.com/tr)', '', ...rows.map(([k, v]) => `${k}: ${v}`), '', note || '(not yok)', '', `WhatsApp: ${waLink}`].join('\n'),
      html: [
        '<p>Yeni teklif talebi (eyessoftware.com/tr)</p><table cellpadding="4">',
        ...rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`),
        '</table><hr>',
        `<p>${escapeHtml(note || '(not yok)').replace(/\n/g, '<br>')}</p>`,
        `<p><a href="${escapeHtml(waLink)}">WhatsApp'tan yaz</a></p>`,
      ].join(''),
    });
    if (error) {
      console.error('Resend error:', error);
      res.status(502).json({ error: 'Failed to send email.' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Quote form error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, host, () => {
  console.log(`EyesSoftware server listening on ${host}:${port}`);
});
