'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbBrandGithub, TbBrandLinkedin, TbMail, TbMapPin, TbSend } from 'react-icons/tb';
import commonConfig from '@/database/config/metadata.json';
import styles from './Contact.module.scss';

const contactEmail = 'barancelal58@hotmail.com';
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const hasTurnstile = Boolean(turnstileSiteKey);

export default function Contact() {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isTurnstileReady, setIsTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('');
    if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  const renderTurnstile = useCallback(() => {
    if (!hasTurnstile || !turnstileRef.current || typeof window === 'undefined' || !window.turnstile) return;
    if (widgetIdRef.current !== null) return;

    try {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        size: 'normal',
        callback: (token) => {
          setTurnstileToken(token);
          setErrors((current) => {
            const next = { ...current };
            delete next.captcha;
            return next;
          });
        },
        'expired-callback': () => {
          setTurnstileToken('');
        },
        'error-callback': () => {
          setTurnstileToken('');
          setErrors((current) => ({
            ...current,
            captcha: 'Le CAPTCHA ne s’est pas chargé. Recharge la page puis réessaie.'
          }));
        }
      });
    } catch {
      setErrors((current) => ({
        ...current,
        captcha: 'Le CAPTCHA ne s’est pas chargé. Recharge la page puis réessaie.'
      }));
    }
  }, []);

  useEffect(() => {
    if (isTurnstileReady) renderTurnstile();
  }, [isTurnstileReady, renderTurnstile]);

  const submit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const message = data.get('message')?.trim();
    const nextErrors = {};

    if (!name) nextErrors.name = 'Ajoute ton nom.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Ajoute une adresse e-mail valide.';
    if (!message || message.length < 12) nextErrors.message = 'Ajoute un message un peu plus complet.';
    if (hasTurnstile && !turnstileToken) nextErrors.captcha = 'Valide le CAPTCHA avant d’envoyer.';

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
      {hasTurnstile && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          async
          defer
          onLoad={() => setIsTurnstileReady(true)}
        />
      )}

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

          {hasTurnstile && (
            <div className={styles.captchaBlock}>
              <span>Vérification anti-robot</span>
              <div ref={turnstileRef} className={styles.turnstileWidget} />
              {errors.captcha && <small role="alert">{errors.captcha}</small>}
            </div>
          )}

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
