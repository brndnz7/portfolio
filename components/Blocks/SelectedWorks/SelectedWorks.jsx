'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiGooglemaps, SiLaravel, SiLinux, SiNextdotjs, SiReact, SiRiotgames, SiTauri, SiUnity } from 'react-icons/si';
import { TbApi, TbArrowLeft, TbArrowRight, TbStack2 } from 'react-icons/tb';
import { projects } from '@/database/projects';
import Title from '@/components/UI/Elements/Title/Title';
import TextReveal from '@/components/UI/Elements/TextReveal/TextReveal';
import styles from './SelectedWorks.module.scss';

const personalSlugs = new Set(['geodevinette', 'counterlol', 'evolve2d', 'trk-lol', 'zen-lol', 'new-horizon', 'ecostay', 'green-life']);
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
  if (filter === 'system') return /debian|python|shell|système|diagnostic/.test(haystack);
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

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(`.${styles.browser}`, {
      y: 70,
      autoAlpha: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' }
    });
  }, { scope: sectionRef });

  const selectGroup = (value) => { setGroup(value); setFilter('all'); setActive(0); };
  const selectFilter = (value) => { setFilter(value); setActive(0); };
  const move = (direction) => {
    if (!visibleProjects.length) return;
    setActive((current) => (current + direction + visibleProjects.length) % visibleProjects.length);
  };

  const positionOf = (index) => {
    let position = index - active;
    const total = visibleProjects.length;
    if (position > total / 2) position -= total;
    if (position < -total / 2) position += total;
    return position;
  };

  return (
    <section className={styles.section} id="works" ref={sectionRef}>
      <header className={styles.header}>
        <Title color="white">Sélection<br />Récente</Title>
        <TextReveal className={styles.description}>
          Des projets académiques, professionnels et personnels. Chaque carte mène vers une étude de cas qui documente le besoin, les choix et les résultats.
        </TextReveal>
      </header>

      <div className={styles.browser}>
        <nav className={styles.commandBar} aria-label="Explorer les projets">
          <div className={styles.tabs} role="tablist" aria-label="Type de projet">
            <button type="button" role="tab" aria-selected={group === 'academic'} onClick={() => selectGroup('academic')}>Académique & pro</button>
            <button type="button" role="tab" aria-selected={group === 'personal'} onClick={() => selectGroup('personal')}>Personnel</button>
          </div>

          <div className={styles.filterMenu} aria-label="Filtrer par technologie">
            {filters.map((item) => {
              const Icon = item.icon;
              return <button type="button" key={item.id} className={filter === item.id ? styles.isActive : ''} onClick={() => selectFilter(item.id)} aria-label={`Filtrer par ${item.label}`} aria-pressed={filter === item.id}><Icon aria-hidden="true" /><small>{item.label}</small></button>;
            })}
          </div>

          <div className={styles.projectMenu} aria-label="Choisir un projet">
            {visibleProjects.map((project, index) => {
              const ProjectIcon = getProjectIcon(project);
              return <button type="button" key={project.slug} onClick={() => setActive(index)} aria-current={active === index ? 'true' : undefined}>
                <ProjectIcon aria-hidden="true" />{project.title}
              </button>;
            })}
          </div>
        </nav>

        <div
          className={styles.stage}
          tabIndex={0}
          aria-label="Carrousel spatial des projets"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
          }}
          onPointerDown={(event) => { dragStart.current = event.clientX; }}
          onPointerUp={(event) => {
            if (dragStart.current === null) return;
            const delta = event.clientX - dragStart.current;
            if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
            dragStart.current = null;
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => {
              const position = positionOf(index);
              const isActive = position === 0;
              if (Math.abs(position) > 1) return null;
              return (
                <motion.article
                  layout
                  key={project.slug}
                  className={styles.projectCard}
                  data-active={isActive}
                  initial={{ opacity: 0, scale: .78 }}
                  animate={{
                    x: `${position * 69}%`,
                    y: isActive ? 0 : 24,
                    scale: isActive ? 1 : .76,
                    rotateY: position * -18,
                    opacity: isActive ? 1 : .28,
                    zIndex: isActive ? 10 : 3
                  }}
                  exit={{ opacity: 0, scale: .7 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 25 }}
                  onClick={() => !isActive && setActive(index)}
                  aria-hidden={!isActive}
                >
                  <Image src={project.images[0]} alt={`Aperçu de ${project.title}`} fill sizes="(max-width: 800px) 88vw, 62vw" priority={isActive} />
                  <div className={styles.cardShade} />
                  {project.mediaPending && <span className={styles.placeholder}>Visuel temporaire</span>}
                  <div className={styles.cardCopy}>
                    <span>{project.eyebrow}</span>
                    <h2>{project.title}</h2>
                    <p>{project.summary}</p>
                    <ul>{project.stack.slice(0, 4).map((tech) => <li key={tech}>{tech}</li>)}</ul>
                    {isActive && <Link href={`/projets/${project.slug}`}>Voir l’étude de cas</Link>}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {!visibleProjects.length && <p className={styles.empty}>Aucun projet dans ce filtre.</p>}

          {visibleProjects.length > 1 && <div className={styles.controls}>
            <button type="button" onClick={() => move(-1)} aria-label="Projet précédent"><TbArrowLeft aria-hidden="true" /><span>Précédent</span></button>
            <div><strong>{String(active + 1).padStart(2, '0')}</strong><i /><span>{String(visibleProjects.length).padStart(2, '0')}</span></div>
            <button type="button" onClick={() => move(1)} aria-label="Projet suivant"><span>Suivant</span><TbArrowRight aria-hidden="true" /></button>
          </div>}
        </div>
      </div>
    </section>
  );
}
