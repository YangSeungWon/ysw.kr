import React from 'react';
import Head from '@docusaurus/Head';
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
  const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
  const pageDescription = description || siteConfig.tagline;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <html className="homepage-active" />
      </Head>
      <div className="homepage-layout">
        {children}
      </div>
    </>
  );
}
