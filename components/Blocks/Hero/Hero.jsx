import commonConfig from '@/database/config/metadata.json';
import ShaderAnimation from '@/components/UI/ShaderAnimation/ShaderAnimation';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroFrame}>
        <div className={styles.background}>
          <ShaderAnimation />
          <div className={styles.shaderVeil} />
          <div className={styles.noise} />
        </div>

        <div className={styles.inner}>
          <div className={styles.title}>
            <h1>
              Je suis Baran.
              <span>Développeur web et créateur d’expériences interactives.</span>
            </h1>
            <p>{commonConfig.metadata.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
