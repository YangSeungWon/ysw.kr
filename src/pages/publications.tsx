import React from 'react';
import Link from '@/components/SiteLink';
import Layout from '@theme/Layout';
import { publications, demonstrations, type Publication } from '@/data/publications';
import styles from '@/components/PlainPage.module.css';

function PublicationList({ items }: { items: Publication[] }) {
  return (
    <ul className={styles.publications}>
      {items.map(pub => (
        <li key={pub.id} className={styles.publication}>
          <span className={styles.number}>[{pub.id}]</span>
          <div>
            <h3 className={styles.publicationTitle}>{pub.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: pub.authors }} />
            <p>{pub.publicationVenue}</p>
            {pub.award && <p className={styles.award}>{pub.award}</p>}
            <div className={styles.links}>
              {pub.links.map(link => (
                <Link key={`${link.type}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.type}
                </Link>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Publications(): JSX.Element {
  return (
    <Layout title="Publications" description="Research Publications">
      <div className={styles.page}>
        <h1>Publications</h1>
        <section>
          <h2>Conference Papers</h2>
          <PublicationList items={publications} />
        </section>
        <section>
          <h2>Demonstrations and Extended Abstracts</h2>
          <PublicationList items={demonstrations} />
        </section>
      </div>
    </Layout>
  );
}
