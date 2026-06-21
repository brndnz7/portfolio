'use client';

import { useState } from 'react';
import styles from './PortfolioHome.module.scss';

export default function ContactForm() {
  const [errors, setErrors] = useState({});

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors = {};
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const message = data.get('message')?.trim();
    if (!name) nextErrors.name = 'Indiquez votre nom.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Indiquez une adresse e-mail valide.';
    if (!message || message.length < 12) nextErrors.message = 'Ajoutez au moins 12 caractères.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const subject = encodeURIComponent(`Contact portfolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\nRéponse à : ${email}`);
    window.location.href = `mailto:barancelal58@hotmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className={styles.contactForm} onSubmit={submit} noValidate>
      <div>
        <label htmlFor="contact-name">Nom</label>
        <input id="contact-name" name="name" autoComplete="name" aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <span id="name-error" role="alert">{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="contact-email">E-mail</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <span id="email-error" role="alert">{errors.email}</span>}
      </div>
      <div className={styles.fullField}>
        <label htmlFor="contact-message">Votre message</label>
        <textarea id="contact-message" name="message" rows="5" aria-describedby={errors.message ? 'message-error' : undefined} />
        {errors.message && <span id="message-error" role="alert">{errors.message}</span>}
      </div>
      <button type="submit">Préparer l’e-mail <span aria-hidden="true">↗</span></button>
    </form>
  );
}
