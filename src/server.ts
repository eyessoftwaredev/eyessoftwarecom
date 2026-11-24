import express, { type Request, type Response } from 'express';
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

// /tr/ landing page was removed; send old links to the homepage.
app.get(/^\/tr(\/.*)?$/, (_req: Request, res: Response) => {
  res.redirect(301, '/');
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
