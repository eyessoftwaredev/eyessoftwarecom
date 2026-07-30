import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
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

app.use(express.static(publicDir));

app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Email service not configured.' });
      return;
    }

    const { name, email, message } = req.body as ContactBody;

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
      to: ['info@eyessoftware.com', 'dev@eyessoftware.com'],
      replyTo: trimmedEmail,
      subject: `${trimmedName} x Form`,
      text: `${trimmedMessage}\n\n---\nSender email: ${trimmedEmail}`,
      html: [
        `<p>${escapeHtml(trimmedMessage).replace(/\n/g, '<br>')}</p>`,
        '<hr>',
        `<p><strong>Sender email:</strong> ${escapeHtml(trimmedEmail)}</p>`,
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
