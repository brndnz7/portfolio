'use client';

import { useState } from 'react';
import { TbBrandGithub, TbBrandLinkedin, TbMail, TbMapPin, TbSend } from 'react-icons/tb';
import commonConfig from '@/database/config/metadata.json';
import styles from './Contact.module.scss';

const contactEmail = 'barancelal58@hotmail.com';

export default function Contact() {
  const [errors, setErrors] = useState({});

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const message = data.get('message')?.trim();
    const nextErrors = {};

    if (!name) nextErrors.name = 'Ajoute ton nom.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Ajoute une adresse e-mail valide.';
    if (!message || message.length < 12) nextErrors.message = 'Ajoute un message un peu plus complet.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const subject = encodeURIComponent(`Contact portfolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\nRéponse à : ${email}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>
          <h2>Une idée, un stage, une mission&nbsp;?</h2>
          <p>
            Envoie-moi un message. Le formulaire prépare directement un e-mail
            avec ton contenu pour garder un contact simple et fiable.
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

          <button type="submit">
            Envoyer le message
            <TbSend aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
