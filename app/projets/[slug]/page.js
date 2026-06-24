import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/database/projects';
import styles from './project.module.scss';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default function ProjectPage({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const challenges = project.challenges || ['Approfondir le contexte et les contraintes du projet.'];
  const decisions = project.decisions || ['Adapter la solution aux besoins identifiés et aux outils disponibles.'];
  const results = project.results || ['Projet livré et documenté dans le portfolio.'];
  const competencies = project.competencies || [];
  const images = project.images || [];

  return (
    <div className={styles.page} style={{ '--project-accent': project.accent }}>
      <nav className={styles.topbar} aria-label="Navigation de l’étude de cas">
        <span>Étude de cas · {project.category}</span>
        <Link href="/#works" className={styles.topAction}>Retour aux projets</Link>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <span>{project.eyebrow}</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        {project.links?.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}</a>
            ))}
          </div>
        )}
      </header>

      {images[0] && (
        <div className={styles.cover}>
          <Image src={images[0]} alt={`Aperçu principal de ${project.title}`} fill priority sizes="100vw" />
        </div>
      )}

      {project.mediaPending && (
        <aside className={styles.mediaNotice}>
          <strong>Visuel temporaire</strong>
          <p>La capture définitive remplacera ce visuel dans <code>{project.imageSlot}</code>.</p>
          {project.confidentiality && <p>{project.confidentiality}</p>}
        </aside>
      )}

      <section className={styles.overview}>
        <div><span>Contexte</span><p>{project.context || project.summary}</p></div>
        <div><span>Besoin</span><p>{project.need || 'Concevoir et livrer une réponse numérique cohérente.'}</p></div>
        <div><span>Mon rôle</span><p>{project.role || 'Conception et développement du projet.'}</p></div>
        <div><span>Cadre</span><p>{project.team || project.category}<small>{project.duration}</small></p></div>
      </section>

      <section className={styles.process}>
        <div>
          <span className={styles.sectionLabel}>Défis</span>
          <h2>Comprendre avant de produire.</h2>
          <ol>{challenges.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
        </div>
        <div>
          <span className={styles.sectionLabel}>Décisions</span>
          <h2>Choisir, construire, vérifier.</h2>
          <ol>{decisions.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
        </div>
      </section>

      {images.length > 1 && (
        <section className={styles.gallery} aria-label="Captures du projet">
          {images.slice(1).map((image, index) => (
            <figure key={image}>
              <Image src={image} alt={`Vue ${index + 2} du projet ${project.title}`} fill sizes="(max-width: 700px) 94vw, 50vw" />
            </figure>
          ))}
        </section>
      )}

      <section className={styles.outcomes}>
        <div><span className={styles.sectionLabel}>Résultats</span><h2>Ce que le projet démontre.</h2></div>
        <ul>{results.map((result) => <li key={result}>{result}</li>)}</ul>
      </section>

      {competencies.length > 0 && (
        <section className={styles.competenceBlock}>
          <span className={styles.sectionLabel}>Compétences mobilisées</span>
          <ul>{competencies.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      {project.ai && (
        <section className={styles.aiBlock}>
          <span>Workflow IA</span>
          <h2>Assister sans déléguer la décision.</h2>
          <p>{project.ai}</p>
          <Link href="/journal/workflow-ia">Consulter la méthode complète</Link>
        </section>
      )}

      <footer className={styles.next}>
        <p>Revenir à la sélection et découvrir les autres projets.</p>
        <Link href="/#works">Tous les projets</Link>
      </footer>
    </div>
  );
}
