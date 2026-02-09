"use client";

import React, { useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import Works from '@/database/Works.json';
import commonConfig from "@/database/config/metadata.json";

import styles from './SelectedWorks.module.scss';

import Title from "@/components/UI/Elements/Title/Title";
import FancyButton from "@/components/UI/Elements/Button/Button";
import TextReveal from "@/components/UI/Elements/TextReveal/TextReveal";

export default function SelectedWorks() {
    const activeWorks = Works.filter(work => work.status);
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });

    const openLightbox = (images, index) => {
        setLightbox({ isOpen: true, images, currentIndex: index });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightbox({ isOpen: false, images: [], currentIndex: 0 });
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setLightbox(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }));
    };

    const prevImage = () => {
        setLightbox(prev => ({ 
            ...prev, 
            currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1 
        }));
    };

    return (
        <section className={styles.section} id={'works'}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Title color="white">Sélection<br/>Récente</Title>
                    <div className={styles.headerContent}>
                        <TextReveal className={styles.description}>
                            Une immersion dans mes projets les plus ambitieux.
                            Design, développement et interaction.
                        </TextReveal>
                    </div>
                </header>

                <div className={styles.gallery}>
                    {activeWorks.map((work, index) => {
                        return (
                            <Card 
                                key={index} 
                                i={index} 
                                {...work} 
                                onImageClick={(images, imgIndex) => openLightbox(images, imgIndex)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox.isOpen && (
                    <motion.div 
                        className={styles.lightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                    >
                        <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={closeLightbox}>×</button>
                            
                            {lightbox.images.length > 1 && (
                                <button className={styles.navBtn} onClick={prevImage}>‹</button>
                            )}
                            
                            <div className={styles.lightboxImageWrapper}>
                                <Image
                                    src={lightbox.images[lightbox.currentIndex]}
                                    alt="Project view"
                                    fill
                                    quality={100}
                                    sizes="90vw"
                                    className={styles.lightboxImage}
                                />
                            </div>
                            
                            {lightbox.images.length > 1 && (
                                <button className={styles.navBtn} onClick={nextImage}>›</button>
                            )}
                            
                            {lightbox.images.length > 1 && (
                                <div className={styles.thumbnails}>
                                    {lightbox.images.map((img, idx) => (
                                        <div 
                                            key={idx}
                                            className={`${styles.thumb} ${idx === lightbox.currentIndex ? styles.active : ''}`}
                                            onClick={() => setLightbox(prev => ({ ...prev, currentIndex: idx }))}
                                        >
                                            <Image src={img} alt="" fill quality={80} sizes="100px" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className={styles.counter}>
                                {lightbox.currentIndex + 1} / {lightbox.images.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

const Card = ({i, title, description, technologies, url, image, images, video, color, date, service, onImageClick}) => {
    const glowColor = `hsla(${color.h}, ${color.s}, ${color.l}, 0.5)`;
    
    // Déterminer si on utilise un tableau d'images ou une image simple
    const projectImages = images || (image ? [image] : []);
    const hasMultipleImages = projectImages.length > 1;

    return (
        <div className={styles.cardContainer}>
            <div 
                className={styles.card} 
                style={{
                    '--glow-color': glowColor,
                    transform: `translateY(${i * 20}px)`
                }}
            >
                <div className={styles.cardBlob}></div>

                <div className={styles.cardBody}>
                    <div className={styles.meta}>
                        <span className={styles.year}>{date}</span>
                        <div className={styles.separator}></div>
                        <span className={styles.service}>{service}</span>
                    </div>
                    
                    <h2 className={styles.title}>
                        {title}
                    </h2>
                    
                    <ul className={styles.technologies}>
                        {technologies && technologies.slice(0, 4).map((tech, index) => (
                            <li key={index} className={styles.tech}>
                                {tech}
                            </li>
                        ))}
                    </ul>

                    <p className={styles.projectDesc}>
                        {description}
                    </p>

                    <div className={styles.actions}>
                        {url && (
                             <FancyButton theme='button-1' link={url} target={'_blank'}>
                                 Voir le projet
                             </FancyButton>
                        )}
                    </div>
                </div>
                
                <div className={styles.cardImage}>
                    {video ? (
                        <div className={styles.imageInner}>
                            <video
                                src={video}
                                poster={projectImages[0]}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={styles.img}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ) : hasMultipleImages ? (
                        // Grille de 4 images
                        <div className={styles.imageGrid}>
                            {projectImages.slice(0, 4).map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className={styles.gridItem}
                                    onClick={() => onImageClick(projectImages, idx)}
                                >
                                    <Image
                                        src={img}
                                        alt={`${title} - view ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw" 
                                        quality={100}
                                        className={styles.img}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className={styles.zoomIcon}>+</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Image simple
                        <div className={styles.imageInner} onClick={() => onImageClick(projectImages, 0)}>
                            <Image
                                src={projectImages[0]}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={90}
                                className={styles.img}
                                style={{ objectFit: 'cover' }}
                                priority={i < 2}
                            />
                            <div className={styles.zoomOverlay}>
                                <span>Cliquer pour agrandir</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}