import Image from 'next/image';
import Link from 'next/link';
import { flagshipProjects, getProjectBySlug, labProjects } from '@/database/projects';
import styles from './ProjectOverview.module.scss';

const geoProject = getProjectBySlug('geodevinette');
const evolveProject = getProjectBySlug('evolve2d');
const spotlightProjects = [...flagshipProjects, geoProject, evolveProject];

export default function ProjectOverview() {
  return (
    <>
      <section className={styles.spotlight} aria-labelledby="spotlight-title">
        <header>
          <p>Travail en contexte professionnel</p>
          <h2 id="spotlight-title">De l’atelier au produit numérique.</h2>
          <span>Deux projets ITGREEN structurent mon année : un système Linux métier et un intranet connecté aux outils de l’entreprise.</span>
        </header>

        <div className={styles.bento}>
          {spotlightProjects.map((project) => (
            <Link
              className={styles.tile}
              data-project={project.slug}
              href={`/projets/${project.slug}`}
              key={project.slug}
              style={{ '--accent': project.accent }}
            >
              <Image src={project.images[0]} alt="" fill sizes="(max-width: 800px) 92vw, 55vw" />
              <span className={styles.scrim} />
              {project.mediaPending && <span className={styles.pending}>Visuel temporaire</span>}
              <div>
                <p>{project.status}</p>
                <h3>{project.title}</h3>
                <span>{project.summary}</span>
                <strong>Lire l’étude de cas <i aria-hidden="true">↗</i></strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.lab} aria-labelledby="lab-title">
        <header>
          <p>Produits en construction</p>
          <h2 id="lab-title">Mes laboratoires, avec leur vrai statut.</h2>
          <span>Un projet en pause n’est pas un projet raté. Je documente aussi les arbitrages, le périmètre et ce que chaque exploration prépare.</span>
        </header>
        <div className={styles.accordion}>
          {labProjects.map((project) => (
            <article key={project.slug} tabIndex={0} style={{ '--accent': project.accent }}>
              <div className={styles.labIndex}>{project.title.slice(0, 2).toUpperCase()}</div>
              <div className={styles.labCopy}>
                <p>{project.status}</p>
                <h3>{project.title}</h3>
                <span>{project.summary}</span>
                <ul>{project.stack.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                <Link href={`/projets/${project.slug}`}>Voir la démarche <i aria-hidden="true">↗</i></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
