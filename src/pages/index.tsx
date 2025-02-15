import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src="/img/seungwon.jpg" alt="Seungwon Yang" className={styles.heroAvatar} />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/about">
            About Me
          </Link>
          <a href={require("/cv.pdf").default}>
            <Link
              className="button button--info button--lg">
              CV
            </Link>
          </a>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--md"
            to="misc">
            Misc
          </Link>
          <Link
            className="button button--secondary button--md"
            to="tools">
            Tools
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
