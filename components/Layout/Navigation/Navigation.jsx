'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TbBriefcase, TbFileCv, TbMail, TbRoute, TbTools } from 'react-icons/tb';
import PageList from '@/database/PageList.json';
import styles from './Navigation.module.scss';

const LiquidGlass = dynamic(() => import('liquid-glass-react'), {
  ssr: false,
  loading: () => <div className={styles.glassFallback} aria-hidden="true" />
});

const icons = {
  skills: TbTools,
  works: TbBriefcase,
  experience: TbRoute,
  resume: TbFileCv,
  contact: TbMail
};

export default function Navigation({ setMenuOpen }) {
  const navigationRef = useRef(null);
  const items = useMemo(() => Object.entries(PageList)
    .filter(([, item]) => item.showOnNavigation && item.isActive), []);
  const [activeLink, setActiveLink] = useState(items[0]?.[1].link || '');
  const { contextSafe } = useGSAP({ scope: navigationRef });

  useEffect(() => {
    const sections = items
      .filter(([, item]) => item.link.startsWith('#'))
      .map(([, item]) => document.querySelector(item.link))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveLink(`#${visible.target.id}`);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .25] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = contextSafe((link) => {
    setMenuOpen(false);
    setActiveLink(link);
    gsap.registerPlugin(ScrollToPlugin);
    gsap.to(window, { duration: .9, scrollTo: link, ease: 'power3.inOut' });
  });

  return (
    <div className={styles.container}>
      <div className={styles.glassHost}>
        <LiquidGlass
          className={styles.liquidGlass}
          displacementScale={46}
          blurAmount={0.08}
          saturation={145}
          aberrationIntensity={1.5}
          elasticity={0.12}
          cornerRadius={999}
          padding="0"
          mode="standard"
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        >
          <nav className={styles.navigation} ref={navigationRef} aria-label="Navigation principale">
            <ul>
              {items.map(([key, item]) => {
                const Icon = icons[key] || TbBriefcase;
                const isActive = activeLink === item.link;

                return (
                  <li key={key}>
                    {item.link.startsWith('#') ? (
                      <button
                        type="button"
                        className={isActive ? styles.active : ''}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={item.title}
                        onClick={() => scrollToSection(item.link)}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.title}</span>
                        {isActive && (
                          <motion.i
                            className={styles.lamp}
                            layoutId="navigation-lamp"
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link href={item.link} aria-label={item.title}>
                        <Icon aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </LiquidGlass>
      </div>
    </div>
  );
}
