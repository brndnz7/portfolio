import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const recipientEmail = process.env.CONTACT_TO_EMAIL || 'barancelal58@hotmail.com';
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Portfolio Baran <onboarding@resend.dev>';
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY || '';

function clean(value, maxLength = 1000) {
  return String(value || '').trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function verifyTurnstile(token, request) {
  if (!turnstileSecretKey) {
    return {
      success: true,
      message: 'CAPTCHA non configuré, vérification ignorée.'
    };
  }

  if (!token) {
    return {
      success: false,
      message: 'Valide le CAPTCHA avant d’envoyer.'
    };
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const remoteip = forwardedFor?.split(',')[0]?.trim();

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: turnstileSecretKey,
      response: token,
      remoteip,
      idempotency_key: crypto.randomUUID()
    })
  });

  if (!response.ok) {
    return {
      success: false,
      message: 'La vérification CAPTCHA est indisponible pour le moment.'
    };
  }

  const result = await response.json();

  return {
    success: Boolean(result.success),
    message: result.success
      ? 'CAPTCHA validé.'
      : 'La vérification CAPTCHA a échoué. Réessaie avant d’envoyer.'
  };
}

export async function GET() {
  return NextResponse.json({ provider: 'cloudflare-turnstile' });
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Requête invalide.' }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const message = clean(payload.message, 4000);
  const company = clean(payload.company, 180);
  const turnstileToken = clean(payload.turnstileToken, 2048);

  if (company) {
    return NextResponse.json({ message: 'Message ignoré.' }, { status: 200 });
  }

  if (!name || !isValidEmail(email) || message.length < 12) {
    return NextResponse.json({ message: 'Merci de vérifier les champs du formulaire.' }, { status: 400 });
  }

  const captcha = await verifyTurnstile(turnstileToken, request);

  if (!captcha.success) {
    return NextResponse.json({ message: captcha.message }, { status: 400 });
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { message: 'Le service d’envoi mail n’est pas encore configuré.' },
      { status: 503 }
    );
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipientEmail],
      reply_to: email,
      subject: `Contact portfolio - ${name}`,
      text: [
        `Nom : ${name}`,
        `E-mail : ${email}`,
        '',
        message
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>E-mail :</strong> ${escapeHtml(email)}</p>
          <hr />
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        </div>
      `
    })
  });

  if (!resendResponse.ok) {
    const result = await resendResponse.json().catch(() => ({}));
    return NextResponse.json(
      { message: result.message || 'Resend n’a pas pu envoyer le message.' },
      { status: resendResponse.status }
    );
  }

  return NextResponse.json({ message: 'Message envoyé.' });
}
