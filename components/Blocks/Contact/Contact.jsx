'use client';

import Script from 'next/script';
import { useState } from 'react';
import { TbBrandGithub, TbBrandLinkedin, TbMail, TbMapPin, TbSend } from 'react-icons/tb';
import commonConfig from '@/database/config/metadata.json';
import styles from './Contact.module.scss';

const contactEmail = 'barancelal58@hotmail.com';
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

function resetTurnstile() {
  if (typeof window !== 'undefined' && window.turnstile) {
    window.turnstile.reset();
  }
}

export default function Contact() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSending, setIsSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const message = data.get('message')?.trim();
    const turnstileToken = data.get('cf-turnstile-response')?.trim();
    const nextErrors = {};

    if (!name) nextErrors.name = 'Ajoute ton nom.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Ajoute une adresse e-mail valide.';
    if (!message || message.length < 12) nextErrors.message = 'Ajoute un message un peu plus complet.';
    if (!turnstileToken) nextErrors.captcha = 'Valide le CAPTCHA avant d’envoyer.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSending(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          company: data.get('company') || '',
          turnstileToken
        })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Impossible d’envoyer le message.');
      }

      form.reset();
      resetTurnstile();
      setStatus({ type: 'success', message: 'Message envoyé, je le recevrai directement par e-mail.' });
    } catch (error) {
      resetTurnstile();
      setStatus({
        type: 'error',
        message: `${error.message} Tu peux aussi m’écrire directement à ${contactEmail}.`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className={styles.section} id="contact">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>
          <h2>Une idée, un stage, une mission&nbsp;?</h2>
          <p>
            Envoie-moi un message. Le formulaire est protégé par un vrai CAPTCHA
            Cloudflare Turnstile, puis il m’envoie directement ton message par e-mail.
          </p>

          <div className={styles.contactLinks}>
            <a href={`mailto:${contactEmail}`}>
              <TbMail aria-hidden="true" />
              {contactEmail}
            </a>
            <span>
              <TbMapPin aria-hidden="true" />
              {commonConfig.personal.city}, {commonConfig.personal.state}
            </span>
            <a href={commonConfig.social.linkedin} target="_blank" rel="noreferrer">
              <TbBrandLinkedin aria-hidden="true" />
              LinkedIn
            </a>
            <a href={commonConfig.social.github} target="_blank" rel="noreferrer">
              <TbBrandGithub aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>

        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.trap} aria-hidden="true">
            <label htmlFor="contact-company">Entreprise</label>
            <input id="contact-company" name="company" tabIndex="-1" autoComplete="off" />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-name">Nom</label>
            <input id="contact-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
            {errors.name && <span role="alert">{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-email">E-mail</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
            {errors.email && <span role="alert">{errors.email}</span>}
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="6" aria-invalid={Boolean(errors.message)} />
            {errors.message && <span role="alert">{errors.message}</span>}
          </div>

          <div className={styles.captchaBlock}>
            <span>Vérification anti-robot</span>
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-theme="dark"
              data-size="normal"
            />
            {errors.captcha && <small role="alert">{errors.captcha}</small>}
          </div>

          {status.message && (
            <p className={styles.status} data-type={status.type} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}

          <button type="submit" disabled={isSending}>
            {isSending ? 'Envoi en cours...' : 'Envoyer le message'}
            <TbSend aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
