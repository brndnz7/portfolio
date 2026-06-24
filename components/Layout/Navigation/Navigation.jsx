'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TbBriefcase, TbFileCv, TbMail, TbRoute, TbSparkles } from 'react-icons/tb';
import PageList from '@/database/PageList.json';
import styles from './Navigation.module.scss';

const icons = {
  skills: TbSparkles,
  works: TbBriefcase,
  experience: TbRoute,
  resume: TbFileCv,
  contact: TbMail
};

export default function Navigation({ isMenuOpen, setMenuOpen }) {
  const navigationRef = useRef(null);
  const items = useMemo(() => Object.entries(PageList)
    .filter(([, item]) => item.showOnNavigation && item.isActive), []);
  const [hovered, setHovered] = useState(null);
  const { contextSafe } = useGSAP({ scope: navigationRef });

  const scrollToSection = contextSafe((link) => {
    setMenuOpen(false);
    gsap.registerPlugin(ScrollToPlugin);
    gsap.to(window, { duration: .85, scrollTo: link, ease: 'power3.inOut' });
  });

  return (
    <div className={`${styles.container} ${isMenuOpen ? styles.menuOpen : ''}`} aria-label="Navigation du portfolio">
      <nav className={styles.navigation} ref={navigationRef}>
        <ul>
          {items.map(([key, item]) => {
            const Icon = icons[key] || TbBriefcase;
            const isHovered = hovered === key;
            const content = (
              <>
                <Icon aria-hidden="true" />
                <span>{item.title}</span>
              </>
            );

            return (
              <li key={key}>
                {item.link.startsWith('#') ? (
                  <button
                    type="button"
                    className={isHovered ? styles.isHovered : ''}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => scrollToSection(item.link)}
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className={isHovered ? styles.isHovered : ''}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
