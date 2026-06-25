'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiGooglemaps, SiLaravel, SiLinux, SiNextdotjs, SiReact, SiRiotgames, SiTauri, SiUnity } from 'react-icons/si';
import { TbApi, TbArrowLeft, TbArrowRight, TbArrowUpRight, TbStack2 } from 'react-icons/tb';
import { projects } from '@/database/projects';
import styles from './SelectedWorks.module.scss';

const personalSlugs = new Set(['geodevinette', 'counterlol', 'evolve2d', 'trk-lol', 'zen-lol', 'ecostay', 'green-life']);

const groups = [
  { id: 'academic', label: 'Académique & pro' },
  { id: 'personal', label: 'Personnel' }
];

const filters = [
  { id: 'all', label: 'Tous', icon: TbStack2 },
  { id: 'web', label: 'React et web', icon: SiReact },
  { id: 'api', label: 'API', icon: TbApi },
  { id: 'system', label: 'Linux et système', icon: SiLinux },
  { id: 'game', label: 'Jeu vidéo', icon: SiUnity }
];

function matchesFilter(project, filter) {
  if (filter === 'all') return true;
  const haystack = `${project.title} ${project.category} ${project.stack.join(' ')}`.toLowerCase();
  if (filter === 'api') return /api|odoo|ebay|street view/.test(haystack);
  if (filter === 'system') return /debian|python|shell|système|systeme|diagnostic/.test(haystack);
  if (filter === 'game') return /jeu|unity|game|2d|idle/.test(haystack);
  return /web|react|next|laravel|wordpress|shopify|tauri|interface/.test(haystack);
}

function getProjectIcon(project) {
  if (project.slug === 'itgreen-os') return SiLinux;
  if (project.slug === 'itgreen-intranet') return TbApi;
  if (project.slug === 'geodevinette') return SiGooglemaps;
  if (project.slug === 'taskmaster' || project.slug === 'usine-a-chocolat') return SiLaravel;
  if (project.slug === 'jeu-course-unity' || project.slug === 'evolve2d') return SiUnity;
  if (project.slug === 'counterlol' || project.slug === 'trk-lol') return SiRiotgames;
  if (project.slug === 'zen-lol') return SiTauri;
  return SiNextdotjs;
}

function getYear(project) {
  return project.eyebrow?.match(/20\d{2}/)?.[0] || project.duration?.match(/20\d{2}/)?.[0] || 'Projet';
}

export default function SelectedWorks() {
  const sectionRef = useRef(null);
  const dragStart = useRef(null);
  const [group, setGroup] = useState('academic');
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(0);

  const visibleProjects = useMemo(() => projects.filter((project) => {
    if (project.tier === 'archive' && !['new-horizon', 'jeu-course-unity'].includes(project.slug)) return false;
    const isPersonal = personalSlugs.has(project.slug);
    return (group === 'personal' ? isPersonal : !isPersonal) && matchesFilter(project, filter);
  }), [group, filter]);

  const total = visibleProjects.length;
  const activeProject = visibleProjects[active] || visibleProjects[0];
  const previousProject = total > 1 ? visibleProjects[(active - 1 + total) % total] : null;
  const nextProject = total > 1 ? visibleProjects[(active + 1) % total] : null;
  const ActiveIcon = activeProject ? getProjectIcon(activeProject) : TbStack2;

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(`.${styles.browser}`, {
      y: 42,
      autoAlpha: 0,
      duration: .75,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' }
    });
  }, { scope: sectionRef });

  const selectGroup = (value) => {
    setGroup(value);
    setFilter('all');
    setActive(0);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setActive(0);
  };

  const move = (direction) => {
    if (!total) return;
    setActive((current) => (current + direction + total) % total);
  };

  return (
    <section className={styles.section} id="works" ref={sectionRef}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2>Mes<br />projets</h2>
          <p>
            Des projets académiques, professionnels et personnels.
            Chaque carte mène vers une étude de cas qui documente le besoin,
            les choix et les résultats.
          </p>
        </header>

        <div className={styles.browser}>
          <nav className={styles.commandBar} aria-label="Explorer les projets">
            <div className={styles.commandBlock}>
              <span>Catégorie</span>
              <div className={styles.tabs} role="tablist" aria-label="Type de projet">
                {groups.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    role="tab"
                    aria-selected={group === item.id}
                    onClick={() => selectGroup(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.commandBlock}>
              <span>Technologie principale</span>
              <div className={styles.filterMenu} aria-label="Filtrer par technologie">
                {filters.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={filter === item.id ? styles.isActive : ''}
                      onClick={() => selectFilter(item.id)}
                      aria-pressed={filter === item.id}
                    >
                      <Icon aria-hidden="true" />
                      <small>{item.label}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div
            className={styles.stage}
            tabIndex={0}
            aria-label="Carrousel des projets"
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1); }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
            }}
            onPointerDown={(event) => { dragStart.current = event.clientX; }}
            onPointerUp={(event) => {
              if (dragStart.current === null) return;
              const delta = event.clientX - dragStart.current;
              if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
              dragStart.current = null;
            }}
          >
            <div className={styles.carousel}>
              {previousProject && (
                <button type="button" className={`${styles.sideCard} ${styles.sideCardLeft}`} onClick={() => move(-1)} aria-label={`Afficher ${previousProject.title}`}>
                  <Image src={previousProject.images[0]} alt="" fill sizes="20vw" />
                  <span>{previousProject.category}</span>
                  <strong>{previousProject.title}</strong>
                  <small>{previousProject.summary}</small>
                </button>
              )}

              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.article
                    key={activeProject.slug}
                    className={styles.featuredCard}
                    style={{ '--project-accent': activeProject.accent || 'hsl(var(--color-primary))' }}
                    initial={{ opacity: 0, y: 22, scale: .99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: .99 }}
                    transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={styles.featuredCopy}>
                      <span className={styles.eyebrow}>
                        <ActiveIcon aria-hidden="true" />
                        {activeProject.category}
                      </span>
                      <h3>{activeProject.title}</h3>
                      <p>{activeProject.summary}</p>

                      <ul>
                        {activeProject.stack.slice(0, 6).map((tech) => <li key={tech}>{tech}</li>)}
                      </ul>

                      <Link href={`/projets/${activeProject.slug}`}>
                        Voir l’étude de cas <TbArrowUpRight aria-hidden="true" />
                      </Link>
                    </div>

                    <div className={styles.featuredImage}>
                      <Image src={activeProject.images[0]} alt={`Aperçu de ${activeProject.title}`} fill sizes="(max-width: 900px) 92vw, 54vw" priority />
                    </div>

                    <dl className={styles.cardMeta}>
                      <div><dt>Nature</dt><dd>{group === 'personal' ? 'Personnel' : 'Académique & pro'}</dd></div>
                      <div><dt>Année</dt><dd>{getYear(activeProject)}</dd></div>
                    </dl>
                  </motion.article>
                )}
              </AnimatePresence>

              {nextProject && (
                <button type="button" className={`${styles.sideCard} ${styles.sideCardRight}`} onClick={() => move(1)} aria-label={`Afficher ${nextProject.title}`}>
                  <Image src={nextProject.images[0]} alt="" fill sizes="20vw" />
                  <span>{nextProject.category}</span>
                  <strong>{nextProject.title}</strong>
                  <small>{nextProject.summary}</small>
                </button>
              )}
            </div>

            {!total && <p className={styles.empty}>Aucun projet dans ce filtre.</p>}

            {total > 1 && (
              <div className={styles.controls} aria-label="Navigation du carrousel">
                <button type="button" onClick={() => move(-1)} aria-label="Projet précédent">
                  <TbArrowLeft aria-hidden="true" />
                  <span>Projet précédent</span>
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Projet suivant">
                  <span>Projet suivant</span>
                  <TbArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
