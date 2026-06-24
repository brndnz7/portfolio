import Link from 'next/link';
import { TbArrowUpRight, TbBrain, TbChecklist, TbPrompt, TbShieldCheck } from 'react-icons/tb';
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
  return (
    <section className={styles.section} id="workflow-ia" aria-labelledby="ai-workflow-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Workflow IA</span>
          <h2 id="ai-workflow-title">Une méthode de co-développement, pas du copier-coller.</h2>
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
    </section>
  );
}
