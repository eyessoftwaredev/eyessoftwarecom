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

app.listen(port, host, () => {
  console.log(`EyesSoftware server listening on ${host}:${port}`);
});
