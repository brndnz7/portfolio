"use client";

import React, { useRef, useState } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import Link from "next/link";

import Works from '@/database/Works.json';
import commonConfig from "@/database/config/metadata.json";

import styles from './SelectedWorks.module.scss';

import Title from "@/components/UI/Elements/Title/Title";
import Magnet from "@/components/UI/Magnet/Magnet";
import FancyButton from "@/components/UI/Elements/Button/Button";
import TextReveal from "@/components/UI/Elements/TextReveal/TextReveal";
import Blobs from "@/components/UI/Elements/Blobs/Blobs";

export default function SelectedWorks() {
    const galleryContainer = useRef();
    const bg = useRef();
    const container = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleProjects, setVisibleProjects] = useState(3);
    const { contextSafe } = useGSAP({scope: container});
    
    const activeWorks = Works.filter(work => work.status);
    const showMoreButton = visibleProjects < activeWorks.length;

    const scrollToNext = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < activeWorks.length) {
            setCurrentIndex(nextIndex);
            const nextElement = galleryContainer.current.children[nextIndex];
            if (nextElement) {
                gsap.to(galleryContainer.current, {
                    x: -nextElement.offsetLeft,
                    duration: 0.8,
                    ease: "power2.inOut"
                });
            }
        }
    };

    const scrollToPrev = () => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            setCurrentIndex(prevIndex);
            const prevElement = galleryContainer.current.children[prevIndex];
            if (prevElement) {
                gsap.to(galleryContainer.current, {
                    x: -prevElement.offsetLeft,
                    duration: 0.8,
                    ease: "power2.inOut"
                });
            }
        }
    };

    const showMoreProjects = () => {
        setVisibleProjects(prev => Math.min(prev + 3, activeWorks.length));
    };

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
        const gallery = galleryContainer.current;

        // BG Animation
        gsap.to(bg.current, {
            scrollTrigger: {
                trigger: container.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
            clipPath: 'inset(0px 0px round 3rem 3rem 0rem 0rem)',
        });

        // Section Pinning - seulement sur desktop
        const mm = gsap.matchMedia();
        
        mm.add("(min-width: 768px)", () => {
            ScrollTrigger.create({
                trigger: container.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: true,
                pinSpacing: true,
            });

            // Désactiver le scroll horizontal - seulement sur desktop
            ScrollTrigger.create({
                trigger: gallery,
                start: 'top top',
                end: 'bottom bottom',
                onEnter: () => {
                    document.body.style.overflow = 'hidden';
                },
                onLeave: () => {
                    document.body.style.overflow = '';
                },
                onEnterBack: () => {
                    document.body.style.overflow = 'hidden';
                },
                onLeaveBack: () => {
                    document.body.style.overflow = '';
                }
            });
        });

    }, { scope: galleryContainer });

    return (
        <section className={styles.section} id={'works'} ref={container}>
            <div className={styles.bg} ref={bg}>
            </div>
            <div className={styles.xScrollContainer} ref={galleryContainer}>
                <header className={styles.header}>
                    <Title color="white">Mes <br/>Travaux</Title>
                    <TextReveal className={styles.description}>
                        Une sélection de mes meilleurs projets et réalisations.
                    </TextReveal>
                    <div className={styles.contactButton}>
                        <FancyButton theme='button-2' link={`mailto:${commonConfig.personal.email}`} target={'_blank'}>
                            Contact
                        </FancyButton>
                    </div>

                    <Blobs type={'v2'}/>
                </header>

                {activeWorks.slice(0, visibleProjects).map((work, index) => {
                    const lightness = parseFloat(work.color.l);
                    return (
                      <div key={index} className={`${styles.browser}`}
                        style={{'--h': work.color.h, '--s': work.color.s, '--l': work.color.l}}>
                          <div className={`${styles.browserHeader} ${lightness >= 50 ? styles.dark : ''}`}>
                              <div className={styles.headerContent}>
                                  <h3 className={styles.title}>{work.title}</h3>
                                  <div className={styles.technologies}>
                                      {work.technologies && work.technologies.map((tech, techIndex) => (
                                          <span key={techIndex} className={styles.tech}>{tech}</span>
                                      ))}
                                  </div>
                                  {work.description && (
                                      <p className={styles.workDescription}>{work.description}</p>
                                  )}
                              </div>

                              {work.url && work.url.trim() !== '' && (
                                <Magnet>
                                    <Link target={'_blank'} className={styles.redirect} href={work.url}>
                                        <span>Visiter</span>
                                        <svg width="93" height="93" viewBox="0 0 93 93" fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                            <rect width="93" height="93" rx="46.5" fill="white"/>
                                            <path
                                              d="M30.0541 60.6172C29.2717 61.3969 29.2717 62.6611 30.0541 63.4407C30.8365 64.2204 32.105 64.2204 32.8874 63.4407L30.0541 60.6172ZM64.56 31.0512C64.56 29.9486 63.663 29.0547 62.5565 29.0547H44.5252C43.4188 29.0547 42.5218 29.9486 42.5218 31.0512C42.5218 32.1538 43.4188 33.0477 44.5252 33.0477H60.553V49.0199C60.553 50.1225 61.45 51.0164 62.5565 51.0164C63.663 51.0164 64.56 50.1225 64.56 49.0199V31.0512ZM32.8874 63.4407L63.9732 32.463L61.1398 29.6395L30.0541 60.6172L32.8874 63.4407Z"
                                              fill="black"/>
                                        </svg>
                                    </Link>
                                </Magnet>
                              )}
                          </div>
                          <div className={styles.browserBody}>
                              <Image
                                src={work.image}
                                alt={work.title}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                width={1920}
                                height={1080}
                                className={styles.image}
                                loading={'lazy'}
                              />
                          </div>
                      </div>
                    );
                })}
                
                {showMoreButton && (
                    <div className={styles.showMoreContainer}>
                        <button 
                            className={styles.showMoreButton}
                            onClick={showMoreProjects}
                        >
                            <span className={styles.plusIcon}>+</span>
                            <span className={styles.showMoreText}>Voir plus</span>
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.navigation}>
                <button 
                    className={`${styles.navButton} ${styles.prevButton}`} 
                    onClick={scrollToPrev}
                    disabled={currentIndex === 0}
                    style={{ opacity: currentIndex === 0 ? 0 : 1 }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button 
                    className={`${styles.navButton} ${styles.nextButton}`} 
                    onClick={scrollToNext}
                    disabled={currentIndex === activeWorks.length - 1}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </section>
    );
}