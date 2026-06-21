import Link from 'next/link';
import styles from './workflow.module.scss';

export const metadata = {
  title: 'Mon workflow avec l’IA',
  description: 'Comment j’utilise l’IA générative sans renoncer à la compréhension, aux tests et à la responsabilité.'
};

const steps = [
  ['01', 'Cadrer', 'Je commence par le besoin, les utilisateurs, les contraintes et les critères de réussite. Un prompt ne remplace pas un brief.'],
  ['02', 'Explorer', 'Je demande plusieurs pistes, compare les compromis et conserve les hypothèses à vérifier plutôt qu’une réponse unique.'],
  ['03', 'Comprendre', 'Je relis le code ligne par ligne, reformule la solution et refuse ce que je ne suis pas capable d’expliquer.'],
  ['04', 'Tester', 'Je confronte le résultat au navigateur, aux erreurs, aux cas limites, à l’accessibilité et aux attentes initiales.'],
  ['05', 'Corriger', 'J’adapte la proposition au projet, simplifie le code et documente les décisions réellement retenues.']
];

export default function WorkflowPage() {
  return (
    <main className={styles.page}>
      <nav><Link href="/">← Retour au portfolio</Link><span>Journal · Méthode</span></nav>
      <header>
        <span>Workflow IA générative</span>
        <h1>Plus vite,<br />mais jamais<br /><em>les yeux fermés.</em></h1>
        <p>L’IA est un multiplicateur : elle accélère autant les bonnes pratiques que les mauvaises. Ma méthode vise donc à garder la compréhension, la vérification et la décision du côté humain.</p>
      </header>
      <section className={styles.steps} aria-label="Les étapes du workflow">
        {steps.map(([number, title, copy]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}
      </section>
      <section className={styles.case}>
        <span>Cas concret — CounterLoL</span>
        <h2>Co-développer ne signifie pas copier-coller.</h2>
        <div>
          <p>Pour CounterLoL, j’ai défini le parcours, les filtres et la direction visuelle. Un assistant IA génératif a accéléré la première version React. J’ai ensuite contrôlé la structure, testé les interactions, documenté les dépendances et corrigé les raccourcis trompeurs.</p>
          <p>Le projet assume également ses limites : les statistiques restent chez U.GG, les images proviennent de Riot Data Dragon et les favoris ne quittent jamais le navigateur.</p>
        </div>
      </section>
      <section className={styles.rules}>
        <h2>Mes garde-fous</h2>
        <ul>
          <li>Ne jamais transmettre de données confidentielles.</li>
          <li>Vérifier les sources et les versions.</li>
          <li>Tester les états réels, pas seulement le cas idéal.</li>
          <li>Signaler honnêtement la contribution de l’IA.</li>
          <li>Rester capable d’expliquer et maintenir le résultat.</li>
        </ul>
      </section>
      <footer><Link href="/#projets">Voir les projets →</Link></footer>
    </main>
  );
}
