'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TbArrowUpRight, TbBrain, TbChecklist, TbChevronDown, TbPrompt, TbShieldCheck } from 'react-icons/tb';
import styles from './AiWorkflowTeaser.module.scss';

const cards = [
  {
    icon: TbPrompt,
    title: 'Prompter avec un cadre',
    copy: 'Je donne le contexte, les contraintes, le niveau attendu et les critères de réussite avant de demander une solution.'
  },
  {
    icon: TbBrain,
    title: 'Comparer les pistes',
    copy: 'Claude Code, Codex, AI Studio ou Antigravity ne servent pas tous au même moment. Je choisis l’outil selon le besoin.'
  },
  {
    icon: TbChecklist,
    title: 'Tester avant de garder',
    copy: 'Je relis, je lance, je casse, je corrige. Une réponse générée n’est jamais validée sans vérification humaine.'
  },
  {
    icon: TbShieldCheck,
    title: 'Garder les limites visibles',
    copy: 'Pas de données confidentielles, pas de décision automatique, pas de code que je ne peux pas expliquer.'
  }
];

export default function AiWorkflowTeaser() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.section} id="workflow-ia" aria-labelledby="ai-workflow-title">
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls="ai-workflow-panel"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={styles.triggerCopy}>
            <strong id="ai-workflow-title">Ma méthode avec les IA génératives</strong>
            <small>Déplier pour voir comment je cadre, vérifie et limite leur usage.</small>
          </span>
          <span className={styles.toggle} aria-hidden="true">
            <TbChevronDown />
          </span>
        </button>

        <div className={styles.content} id="ai-workflow-panel" hidden={!isOpen}>
          <div className={styles.copy}>
            <h2>Une méthode de co-développement, pas du copier-coller.</h2>
            <p>
              J’utilise les IA génératives comme accélérateurs de cadrage, de code, de recherche et de relecture.
              La valeur reste dans le brief, les choix, les tests et la capacité à expliquer ce qui est livré.
            </p>
            <Link href="/journal/workflow-ia" className={styles.cta}>
              Lire ma méthode complète <TbArrowUpRight aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.panel} aria-label="Points clés de mon usage de l’IA">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title}>
                  <Icon aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
