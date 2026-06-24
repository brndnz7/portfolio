import Link from 'next/link';
import styles from './workflow.module.scss';

export const metadata = {
  title: 'Workflow IA',
  description: 'Ma méthode de co-développement avec les IA génératives : cadrage, prompts, outils, tests, limites et preuves dans mes projets.'
};

const tools = [
  {
    name: 'Codex',
    usage: 'Modifier un projet existant, garder le contexte du dépôt, corriger rapidement et vérifier avec lint ou build.',
    limit: 'Je dois rester précis dans le périmètre, sinon l’outil peut trop élargir la tâche.'
  },
  {
    name: 'Claude Code',
    usage: 'Explorer une architecture, relire une logique complexe, obtenir une autre proposition de structure.',
    limit: 'Je ne garde rien sans comprendre le raisonnement ni tester dans mon environnement.'
  },
  {
    name: 'AI Studio',
    usage: 'Prototyper des idées, comparer des formulations, préparer des contenus ou des directions fonctionnelles.',
    limit: 'Utile pour réfléchir, moins suffisant pour valider la qualité finale d’une interface.'
  },
  {
    name: 'Antigravity',
    usage: 'Tester des variantes d’interface et accélérer certains écrans quand le besoin est déjà clair.',
    limit: 'Je l’utilise comme accélérateur visuel, pas comme décisionnaire UX.'
  }
];

const promptRules = [
  ['Contexte', 'Je commence par expliquer le projet, l’utilisateur, le niveau attendu et les contraintes.'],
  ['Objectif', 'Je formule une sortie vérifiable : composant, audit, bug, plan, variante ou test.'],
  ['Contraintes', 'Je précise ce qu’il ne faut pas changer, les fichiers concernés et la DA à respecter.'],
  ['Comparaison', 'Je demande souvent plusieurs pistes avec avantages, risques et effort estimé.'],
  ['Validation', 'Je termine par une demande de relecture critique : accessibilité, logique, performance, sécurité.']
];

const workflow = [
  {
    step: '01',
    title: 'Cadrer',
    copy: 'Avant de prompter, je clarifie le besoin. Qui utilise le produit, quelle tâche doit être simplifiée, quelles contraintes techniques ou pédagogiques sont non négociables.'
  },
  {
    step: '02',
    title: 'Explorer',
    copy: 'Je demande des options, pas une vérité unique. L’IA sert à élargir les pistes : structure de composant, wording, architecture, bugs possibles, tests à prévoir.'
  },
  {
    step: '03',
    title: 'Découper',
    copy: 'Je préfère des petites demandes précises à un énorme prompt flou. Un bon prompt donne un objectif, un contexte, une limite et une définition du résultat attendu.'
  },
  {
    step: '04',
    title: 'Implémenter',
    copy: 'Je garde le contrôle du code final. Je vérifie les imports, l’état, les effets, les erreurs possibles, la cohérence avec le design et les conventions du projet.'
  },
  {
    step: '05',
    title: 'Tester',
    copy: 'Je lance le site, je teste les interactions, le mobile, le clavier, les cas vides, les formulaires, puis je corrige ce qui ne tient pas dans un vrai usage.'
  },
  {
    step: '06',
    title: 'Documenter',
    copy: 'Quand l’IA a aidé, je l’indique. Je précise ce qui a été assisté, ce qui a été vérifié humainement et les limites de la solution.'
  }
];

const cases = [
  {
    project: 'CounterLoL',
    contribution: 'L’IA a accéléré le prototype React, les filtres et certaines idées d’interface.',
    human: 'J’ai repositionné le projet comme raccourci vers U.GG, vérifié les sources Riot, simplifié les données et gardé les favoris en localStorage.'
  },
  {
    project: 'Portfolio PF6',
    contribution: 'Les assistants ont aidé à structurer les études de cas, auditer les consignes et générer des variantes UI.',
    human: 'J’ai arbitré la DA, fourni les projets, refusé les pistes trop lourdes, corrigé les contenus et demandé des ajustements précis.'
  },
  {
    project: 'ITGREEN OS',
    contribution: 'L’IA peut aider à raisonner sur des scripts, des erreurs Linux ou des choix de diagnostic.',
    human: 'Les données internes ne sont pas envoyées aux outils. Les commandes et résultats sont vérifiés sur les machines de test.'
  }
];

const limits = [
  'Je ne donne pas de données confidentielles, de clés API privées ou de captures sensibles.',
  'Je ne valide pas du code que je ne peux pas expliquer.',
  'Je vérifie les versions, les dépendances et les comportements réels.',
  'Je distingue une idée générée d’une décision réellement retenue.',
  'Je garde une trace des corrections humaines, surtout pour les projets évalués.'
];

export default function WorkflowPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.topbar} aria-label="Navigation de l’article">
        <Link href="/#workflow-ia">Retour au portfolio</Link>
        <span>Journal méthode</span>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span>Usage des IA génératives</span>
          <h1>Accélérer sans abandonner la maîtrise.</h1>
          <p>
            J’utilise Codex, Claude Code, AI Studio, Antigravity et d’autres assistants comme des partenaires de travail.
            Mon objectif n’est pas de déléguer la réflexion, mais de mieux cadrer, produire, relire et tester.
          </p>
        </div>
        <aside className={styles.heroCard}>
          <strong>Principe central</strong>
          <p>Une réponse IA n’est qu’une hypothèse rapide. Elle devient utile seulement après compréhension, adaptation et vérification humaine.</p>
        </aside>
      </header>

      <section className={styles.toolGrid} aria-labelledby="tools-title">
        <div className={styles.sectionHeader}>
          <span>Outils</span>
          <h2 id="tools-title">Je choisis l’assistant selon la tâche.</h2>
        </div>
        <div className={styles.tools}>
          {tools.map((tool) => (
            <article key={tool.name}>
              <h3>{tool.name}</h3>
              <p>{tool.usage}</p>
              <small>{tool.limit}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.prompting} aria-labelledby="prompt-title">
        <div>
          <span>Prompting</span>
          <h2 id="prompt-title">Ma façon de demander les choses.</h2>
          <p>
            Je ne cherche pas le prompt magique. Je cherche un cadre de travail clair :
            contexte, objectif, contraintes, format attendu et points à vérifier.
          </p>
        </div>
        <ol>
          {promptRules.map(([title, copy]) => (
            <li key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.workflow} aria-labelledby="workflow-title">
        <div className={styles.sectionHeader}>
          <span>Processus</span>
          <h2 id="workflow-title">Mon workflow en six étapes.</h2>
        </div>
        <div className={styles.steps}>
          {workflow.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cases} aria-labelledby="cases-title">
        <div className={styles.sectionHeader}>
          <span>Preuves</span>
          <h2 id="cases-title">Où l’IA intervient dans mes projets.</h2>
        </div>
        <div className={styles.caseList}>
          {cases.map((item) => (
            <article key={item.project}>
              <h3>{item.project}</h3>
              <div>
                <span>Assistance IA</span>
                <p>{item.contribution}</p>
              </div>
              <div>
                <span>Décision humaine</span>
                <p>{item.human}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.limits} aria-labelledby="limits-title">
        <h2 id="limits-title">Mes garde-fous.</h2>
        <ul>
          {limits.map((limit) => <li key={limit}>{limit}</li>)}
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>Cette méthode est visible dans mes études de cas, notamment CounterLoL, ITGREEN OS et la refonte de ce portfolio PF6.</p>
        <Link href="/#works">Voir les projets</Link>
      </footer>
    </main>
  );
}
