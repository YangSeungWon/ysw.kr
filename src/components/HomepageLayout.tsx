import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface HomepageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function HomepageLayout({
  children,
  title,
  description,
}: HomepageLayoutProps) {
  const { siteConfig } = useDocusaurusContext();
  const pageTitle = title || siteConfig.title;
  const pageDescription = description || siteConfig.tagline;

  return (
    <Layout title={pageTitle} description={pageDescription} noFooter>
      <Head>
        <html className="homepage-active" />
      </Head>
      <div className="homepage-layout">
        {children}
      </div>
    </Layout>
  );
}
