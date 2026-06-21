import Image from 'next/image';
import Link from 'next/link';
import ProjectCarousel from './ProjectCarousel';
import ProjectOverview from './ProjectOverview';
import ContactForm from './ContactForm';
import { archivedProjects } from '@/database/projects';
import { competencies, tools } from '@/database/competencies';
import styles from './PortfolioHome.module.scss';

export default function PortfolioHome() {
  return (
    <>
      <header className={styles.siteHeader}>
        <Link href="#accueil" className={styles.brand} aria-label="Retour en haut">BD<span>.</span></Link>
        <nav aria-label="Navigation principale">
          <a href="#competences">Compétences</a>
          <a href="#projets">Projets</a>
          <a href="#profil">Profil</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className={styles.availability}><i /> Disponible</span>
      </header>

      <main>
        <section className={styles.hero} id="accueil">
          <div className={styles.heroGlow} />
          <div className={styles.heroMeta}>
            <span>Strasbourg · France</span>
            <span>Portfolio S6 · BUT MMI</span>
          </div>
          <div className={styles.heroContent}>
            <p className={styles.overline}>Développement web & dispositifs interactifs</p>
            <h1>Je transforme<br />des idées en <em>expériences</em><br />numériques utiles.</h1>
            <div className={styles.heroBottom}>
              <p>Je suis Baran Deniz, étudiant en BUT MMI. Ce portfolio documente ma manière de développer, collaborer, tester et livrer des produits web.</p>
              <div>
                <a href="#projets" className={styles.primaryCta}>Explorer les projets ↓</a>
                <a href="/cv.pdf" target="_blank" rel="noreferrer" className={styles.secondaryCta}>Télécharger le CV</a>
              </div>
            </div>
          </div>
          <span className={styles.heroIndex}>03</span>
        </section>

        <section className={styles.intro} id="competences">
          <span className={styles.sectionNumber}>01 — Compétences</span>
          <div>
            <p className={styles.introLead}>Au-delà des outils, je montre ce que je sais réellement faire.</p>
            <p>Chaque apprentissage critique est relié à des projets, des décisions et des résultats observables.</p>
          </div>
        </section>

        <section className={styles.competencies} aria-label="Compétences principales">
          {competencies.map((competency) => (
            <article key={competency.id} style={{ '--competency-color': competency.color }}>
              <header>
                <span>{competency.number}</span>
                <div>
                  <p>{competency.level}</p>
                  <h2>{competency.title}</h2>
                </div>
              </header>
              <p className={styles.competencyDescription}>{competency.description}</p>
              <ol>
                {competency.learnings.map((learning) => (
                  <li key={learning.code}>
                    <span>{learning.code}</span>
                    <strong>{learning.label}</strong>
                    <small>{learning.proofs.join(' · ')}</small>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>

        <section className={styles.toolbox} aria-labelledby="toolbox-title">
          <div>
            <span className={styles.sectionNumber}>Boîte à outils</span>
            <h2 id="toolbox-title">Des technologies choisies pour servir le projet.</h2>
          </div>
          <ul>{tools.map((tool, index) => <li key={tool}><span>{String(index + 1).padStart(2, '0')}</span>{tool}</li>)}</ul>
        </section>

        <ProjectOverview />

        <ProjectCarousel />

        <section className={styles.archive} aria-labelledby="archive-title">
          <header>
            <span className={styles.sectionNumber}>Archive</span>
            <h2 id="archive-title">D’autres terrains d’exploration.</h2>
          </header>
          <div className={styles.archiveGrid}>
            {archivedProjects.map((project) => (
              <article key={project.slug}>
                <div className={styles.archiveImage}><Image src={project.images[0]} alt="" fill sizes="(max-width: 700px) 90vw, 25vw" /></div>
                <span>{project.eyebrow}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                {project.links[0] && <a href={project.links[0].href} target="_blank" rel="noreferrer">{project.links[0].label} ↗</a>}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.aiSection}>
          <span className={styles.aiMark}>AI</span>
          <div>
            <span className={styles.sectionNumber}>Workflow documenté</span>
            <h2>L’IA accélère le travail.<br />Elle ne prend pas les décisions.</h2>
            <p>Je cadre le problème, formule des hypothèses, confronte les réponses au code et aux sources, puis teste chaque résultat. Une méthode utile seulement si elle reste critique et traçable.</p>
            <Link href="/journal/workflow-ia">Lire ma méthode ↗</Link>
          </div>
        </section>

        <section className={styles.profile} id="profil">
          <div className={styles.portrait}><Image src="/gallery/baranphoto.JPEG" alt="Portrait de Baran Deniz" fill sizes="(max-width: 700px) 90vw, 40vw" /></div>
          <div>
            <span className={styles.sectionNumber}>02 — Profil</span>
            <h2>Curieux, rigoureux<br />et toujours en mouvement.</h2>
            <p>Après un bac STI2D et une première année en GEII, j’ai rejoint le BUT MMI pour relier technique, création et usages. Mon objectif : devenir un développeur polyvalent capable de comprendre un produit dans son ensemble.</p>
            <dl>
              <div><dt>Formation</dt><dd>BUT MMI · Développement web</dd></div>
              <div><dt>Expérience</dt><dd>Stage · ITGREEN · systèmes et outils internes</dd></div>
              <div><dt>Localisation</dt><dd>Strasbourg, France</dd></div>
            </dl>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <div>
            <span className={styles.sectionNumber}>03 — Contact</span>
            <h2>Un projet, une poursuite d’études ou simplement une discussion ?</h2>
            <p>Le formulaire prépare un e-mail dans votre messagerie. Aucune donnée n’est stockée.</p>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className={styles.footer}>
        <strong>Baran Deniz</strong>
        <div><a href="https://github.com/brndnz7" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/baran-deniz-973ba923a/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
        <span>© 2026 · Conçu et développé à Strasbourg</span>
      </footer>
    </>
  );
}
