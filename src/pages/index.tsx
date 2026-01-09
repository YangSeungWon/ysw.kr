import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { FaGithub, FaLinkedin, FaOrcid } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import { ChevronDown, FileText, Wrench, Folder, User } from 'lucide-react';
import HomepageLayout from '@/components/HomepageLayout';
import HomepagePublicationCard from '@/components/HomepagePublicationCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getAllPublications } from '@/data/publications';

// Animated section wrapper
function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`homepage-section section-animate ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

// Hero Section
function HeroSection() {
  const { siteConfig } = useDocusaurusContext();

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="homepage-hero">
      <img
        src="/img/seungwon.jpg"
        alt="Seungwon Yang"
        className="homepage-hero-image"
      />
      <h1 className="homepage-hero-title">{siteConfig.title}</h1>
      <p className="homepage-hero-subtitle">{siteConfig.tagline}</p>

      {/* Brief About */}
      <div className="homepage-hero-about">
        <p className="homepage-hero-affiliation">
          Ph.D. Student @{' '}
          <a href="https://his-lab.org" target="_blank" rel="noopener noreferrer">
            HISLab
          </a>
          , POSTECH
        </p>
        <p className="homepage-hero-interests">
          Accessibility · Gamification · AR/VR
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="homepage-hero-buttons">
        <a href={require('/cv.pdf').default} className="homepage-hero-btn">
          CV
        </a>
        <Link to="/publications" className="homepage-hero-btn homepage-hero-btn-outline">
          Publications
        </Link>
      </div>

      {/* Social Links */}
      <div className="homepage-social-links">
        <a
          href="https://scholar.google.com/citations?user=YJm0n7gAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="homepage-social-link"
          aria-label="Google Scholar"
        >
          <SiGooglescholar size={24} />
        </a>
        <a
          href="https://github.com/YangSeungWon"
          target="_blank"
          rel="noopener noreferrer"
          className="homepage-social-link"
          aria-label="GitHub"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/seungwon-yang"
          target="_blank"
          rel="noopener noreferrer"
          className="homepage-social-link"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://orcid.org/0009-0009-0755-2450"
          target="_blank"
          rel="noopener noreferrer"
          className="homepage-social-link"
          aria-label="ORCID"
        >
          <FaOrcid size={24} />
        </a>
      </div>

      {/* Scroll Indicator */}
      <button
        className="scroll-indicator"
        onClick={scrollToContent}
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <ChevronDown size={24} className="scroll-indicator-arrow" />
      </button>
    </section>
  );
}

// Publications Section
function PublicationsSection() {
  const allPublications = getAllPublications();

  return (
    <AnimatedSection>
      <h2 className="homepage-section-title">Publications</h2>
      <div className="publications-grid">
        {allPublications.map((pub) => (
          <HomepagePublicationCard key={pub.id} publication={pub} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/publications" className="link-button-secondary link-button">
          View All Publications
        </Link>
      </div>
    </AnimatedSection>
  );
}

// Quick Links Section
function QuickLinksSection() {
  const quickLinks = [
    { to: '/about', icon: <User size={24} />, label: 'About' },
    { to: '/publications', icon: <FileText size={24} />, label: 'Publications' },
    { to: '/tools', icon: <Wrench size={24} />, label: 'Tools' },
    { to: '/misc', icon: <Folder size={24} />, label: 'Misc' },
  ];

  return (
    <AnimatedSection>
      <h2 className="homepage-section-title">Explore</h2>
      <div className="quick-links-grid">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className="quick-link-card">
            <span className="quick-link-icon">{link.icon}</span>
            <span className="quick-link-label">{link.label}</span>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  );
}

// Footer Section (simple, replaces navbar footer)
function FooterSection() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--ifm-font-color-secondary)',
        fontSize: '0.875rem',
        borderTop: '1px solid var(--ifm-color-emphasis-200)',
      }}
    >
      <p style={{ margin: 0 }}>
        Copyright {new Date().getFullYear()} Seungwon Yang. Built with Docusaurus.
      </p>
    </footer>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <HomepageLayout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <HeroSection />
      <PublicationsSection />
      <QuickLinksSection />
      <FooterSection />
    </HomepageLayout>
  );
}
