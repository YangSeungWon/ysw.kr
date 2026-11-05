import React from 'react';
import Link from '@/components/SiteLink';
import type { Publication } from '@/data/publications';
import styles from './Homepage.module.css';

export default function HomepagePublicationCard({ publication }: { publication: Publication }) {
  return (
    <li className={styles.paper}>
      {publication.thumbnail ? (
        <img
          src={publication.thumbnail}
          alt={publication.title}
          className={styles.thumbnail}
          style={{ objectFit: publication.thumbnailFit || 'cover' }}
          width={320}
          height={180}
          loading="lazy"
          decoding="async"
        />
      ) : <div aria-hidden="true" />}
      <div className={styles.details}>
        <h3>{publication.title}</h3>
        <p>{publication.venue}</p>
        {publication.award && <p className={styles.award}>{publication.award}</p>}
        <div className={styles.links}>
          {publication.links.map(link => (
            <Link key={`${link.type}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.type === 'YouTube' ? 'Video' : link.type}
            </Link>
          ))}
        </div>
      </div>
    </li>
  );
}
