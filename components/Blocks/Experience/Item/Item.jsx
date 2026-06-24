'use client';
import React, { useState } from 'react'
import { TbChevronDown } from 'react-icons/tb';
import styles from './Item.module.scss';
export default function Item({position, company, duration, location, image, url, responsibilities = [], color}) {
    const [isOpen, setIsOpen] = useState(false);
    const hasDetails = responsibilities.length > 0 || duration || location;

    return (
        <article className={`${styles.item} ${isOpen ? styles.isOpen : ''}`} style={{'--h': color.h, '--s': color.s, '--l': color.l}}>
          <button
            type="button"
            className={styles.summary}
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
          >
            <div className={styles.left}>
              <div className={styles.title}>
                <h3 data-text={position}>{position}</h3>
              </div>
              <span className={`${styles.info}`}>{company}</span>
            </div>
            <div className={styles.right}>
              <span className={styles.info}>{duration}</span>
              <span className={styles.info}>{location}</span>
            </div>
            <span className={styles.toggle} aria-hidden="true">
              <TbChevronDown />
            </span>
          </button>

          {hasDetails && (
            <div className={styles.details} hidden={!isOpen}>
              {responsibilities.length > 0 ? (
                <ul>
                  {responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : (
                <p>Parcours validé à {location}, période {duration}.</p>
              )}
            </div>
          )}
        </article>
    )
}
