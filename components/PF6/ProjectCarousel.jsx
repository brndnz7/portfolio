'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProjects } from '@/database/projects';
import styles from './ProjectCarousel.module.scss';

export default function ProjectCarousel() {
  const [active, setActive] = useState(0);
  const [linearLayout, setLinearLayout] = useState(false);
  const wheelLocked = useRef(false);
  const dragStart = useRef(null);
  const total = featuredProjects.length;

  const move = (direction) => {
    setActive((current) => (current + direction + total) % total);
  };

  useEffect(() => {
    const query = window.matchMedia('(max-width: 800px), (prefers-reduced-motion: reduce)');
    const updateLayout = () => setLinearLayout(query.matches);
    updateLayout();
    query.addEventListener('change', updateLayout);
    return () => query.removeEventListener('change', updateLayout);
  }, []);

  const handleKeyDown = (event) => {
    if (linearLayout) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    }
  };

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 24 || wheelLocked.current) return;
    wheelLocked.current = true;
    move(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked.current = false; }, 520);
  };

  const cardPosition = (index) => {
    let distance = index - active;
    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;
    return distance;
  };

  return (
    <section className={styles.section} id="projets" aria-labelledby="projects-title">
      <div className={styles.heading}>
        <div>
          <span className={styles.kicker}>Sélection 2025–2026</span>
          <h2 id="projects-title">Six projets,<br />six preuves.</h2>
        </div>
        <p>Faites défiler, glissez ou utilisez les flèches. Chaque projet ouvre une étude de cas documentée.</p>
      </div>

      <div
        className={styles.stage}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onPointerDown={(event) => { dragStart.current = event.clientX; }}
        onPointerUp={(event) => {
          if (dragStart.current === null) return;
          const distance = event.clientX - dragStart.current;
          if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
          dragStart.current = null;
        }}
        aria-roledescription="carrousel"
        aria-label="Projets principaux"
      >
        <div className={styles.cards}>
          {featuredProjects.map((project, index) => {
            const position = cardPosition(index);
            const isActive = position === 0;
            return (
              <article
                className={styles.card}
                data-position={Math.max(-2, Math.min(2, position))}
                data-active={isActive}
                aria-hidden={!linearLayout && !isActive}
                inert={!linearLayout && !isActive ? '' : undefined}
                key={project.slug}
                style={{ '--accent': project.accent }}
              >
                <div className={styles.copy}>
                  <span className={styles.eyebrow}>{project.eyebrow}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul aria-label="Technologies principales">
                    {project.stack.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Link href={`/projets/${project.slug}`} className={styles.caseLink} tabIndex={linearLayout || isActive ? 0 : -1}>
                    Lire l’étude de cas <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                <div className={styles.visual}>
                  <Image src={project.images[0]} alt={`Aperçu du projet ${project.title}`} fill sizes="(max-width: 800px) 92vw, 55vw" priority={index === 0} />
                  <span className={styles.number}>0{index + 1}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.controls}>
          <button type="button" onClick={() => move(-1)} aria-label="Projet précédent">←</button>
          <div className={styles.progress} aria-live="polite">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <div><i style={{ width: `${((active + 1) / total) * 100}%` }} /></div>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Projet suivant">→</button>
        </div>
      </div>
    </section>
  );
}
