import React from 'react';
import Link from '@/components/SiteLink';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { Sun, Moon } from 'lucide-react';
import HomepageLayout from '@/components/HomepageLayout';
import HomepagePublicationCard from '@/components/HomepagePublicationCard';
import { getAllPublications } from '@/data/publications';
import plain from '@/components/PlainPage.module.css';
import styles from '@/components/Homepage.module.css';

function Profile() {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();
  return (
    <header className={styles.profile}>
      <img src="/img/seungwon.webp" alt="Seungwon Yang" className={styles.photo} width={144} height={144} decoding="async" fetchPriority="high" />
      <div className={styles.identity}>
        <h1>{siteConfig.title}</h1>
        <p>Ph.D. Student @ <Link href="https://his-lab.org" target="_blank" rel="noopener noreferrer">HISLab</Link>, <Link href="https://postech.ac.kr" target="_blank" rel="noopener noreferrer">POSTECH</Link></p>
        <div className={styles.links}>
          <a href="/cv.pdf" className={styles.cv}>CV (PDF)</a>
          <Link href="https://scholar.google.com/citations?user=YJm0n7gAAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar</Link>
          <Link href="https://dblp.org/pid/53/759-2.html" target="_blank" rel="noopener noreferrer">DBLP</Link>
          <Link href="https://orcid.org/0009-0009-0755-2450" target="_blank" rel="noopener noreferrer">ORCID</Link>
          <Link href="https://github.com/YangSeungWon" target="_blank" rel="noopener noreferrer">GitHub</Link>
          <Link href="https://www.linkedin.com/in/seungwon-yang" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
        </div>
      </div>
      <button type="button" className={styles.theme} onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')} aria-label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
        {colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <HomepageLayout title={siteConfig.title} description={siteConfig.tagline}>
      <div className={plain.page}>
        <Profile />
        <nav className={`${styles.links} ${styles.navigation}`} aria-label="Main navigation">
          <Link to="/publications">Publications</Link>
          <Link to="/misc">Projects</Link>
          <Link to="/tools">Tools</Link>
        </nav>
        <section className={styles.section}>
          <h2>About</h2>
          <p>Seungwon Yang is a Ph.D. student in Computer Science and Engineering at POSTECH. His research focuses on building human-centered systems that support social interaction and human agency, primarily through AR/VR applications.</p>
          <p>He has attended CHI 2024, CHI 2025, and UIST 2025. He envisions a future where technology empowers people in their everyday lives by supporting their agency, confidence, and meaningful social connections.</p>
          <p>He is also interested in how the AI-driven democratization of software creation reshapes the relationship between people and technology.</p>
          <p>He received his bachelor's degree in Computer Science and Engineering from POSTECH in 2023.</p>
        </section>
        <section className={styles.section}>
          <h2>Publications</h2>
          <ul className={styles.papers}>
            {getAllPublications().map(pub => <HomepagePublicationCard key={pub.id} publication={pub} />)}
          </ul>
          <div className={styles.links}><Link to="/publications">All publications</Link></div>
        </section>
        <section className={styles.section}>
          <h2>Academic Service</h2>
          <p><strong>Reviewer</strong><br />
            CHI 2027 — Papers<br />
            CHI 2026 — Posters · Special Recognition for Reviewing<br />
            DIS 2026 — Papers<br />
            UIST 2026 — Papers
          </p>
          <p><strong>Artefact Evaluation Committee</strong><br />
            <Link href="https://www.sigmobile.org/mobisys/2026/artifact_evaluation_committee/" target="_blank" rel="noopener noreferrer">MobiSys 2026</Link>
          </p>
        </section>
        <footer className={styles.footer}>Copyright {new Date().getFullYear()} Seungwon Yang. Built with Docusaurus.</footer>
      </div>
    </HomepageLayout>
  );
}
