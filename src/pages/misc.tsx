import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const projects = {
  extensions: [
    {
      name: "Voca Web - Smart Vocabulary Builder",
      description: "All-in-one platform for English vocabulary learning with Chrome Extension and web app",
      links: [
        { label: "About", url: "/misc/voca-web" },
        { label: "Web App", url: "https://voca.ysw.kr", external: true },
        { label: "Chrome Store", url: "https://chromewebstore.google.com/detail/voca-web-vocabulary-build/ajflgkmapedegaokdcmpdepepmchfbeo", external: true },
        { label: "GitHub", url: "https://github.com/YangSeungWon/voca-web", external: true }
      ],
      color: "#4A90E2",
      icon: "📚"
    },
    {
      name: "YOWO: You Only Watch Once",
      description: "Watch YouTube videos without getting stuck in endless loops",
      links: [
        { label: "About", url: "/misc/yowo" },
        { label: "Chrome Store", url: "https://chromewebstore.google.com/detail/you-only-watch-once-yowo/licbbogphmmjlffefkigjenihlogehgc", external: true },
        { label: "GitHub", url: "https://github.com/YangSeungWon/you-only-watch-once", external: true }
      ],
      color: "#FF0000",
      icon: "📺"
    },
    {
      name: "Naver Cafe JSON Extractor",
      description: "Extract posts and comments from Naver Cafe in JSON format",
      links: [
        { label: "About", url: "/misc/naver-cafe-json-extractor" },
        { label: "Chrome Store", url: "https://chromewebstore.google.com/detail/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%B9%B4%ED%8E%98-%EB%8C%93%EA%B8%80-%EC%B6%94%EC%B6%9C%EA%B8%B0/hkehmkenhldahnonfaecaflemnpdihjg", external: true },
        { label: "GitHub", url: "https://github.com/YangSeungWon/naver-cafe-comments-extract", external: true }
      ],
      color: "#00C73C",
      icon: "💬"
    }
  ],
  games: [
    {
      name: "Survival Game",
      description: "A challenging survival game where strategy meets resource management",
      links: [
        { label: "About", url: "/misc/survival-game" },
        { label: "Play", url: "https://survival.game.ysw.kr", external: true },
        { label: "GitHub", url: "https://github.com/YangSeungWon/survival-game", external: true }
      ],
      color: "#8B4513",
      icon: "🏕️"
    },
    {
      name: "Lime Game",
      description: "A refreshing puzzle game with citrus-themed challenges",
      links: [
        { label: "About", url: "/misc/lime-game" },
        { label: "Play", url: "https://li.me.kr", external: true },
        { label: "GitHub", url: "https://github.com/YangSeungWon/lime-game", external: true }
      ],
      color: "#32CD32",
      icon: "🍋"
    }
  ]
};

const ProjectCard: React.FC<{
  project: typeof projects.extensions[0];
  index: number;
}> = ({ project, index }) => {
  const aboutLink = project.links.find(link => link.label === "About");
  
  return (
    <Link
      to={aboutLink?.url || '#'}
      className="misc-project-card"
      style={{
        display: 'block',
        background: 'var(--ifm-card-background-color)',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 0.1}s`,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            fontSize: '1.75rem',
            filter: 'grayscale(0.2)',
            transition: 'transform 0.3s ease',
            lineHeight: 1
          }}>
            {project.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.1rem',
              color: 'var(--ifm-heading-color)',
              marginBottom: '0.25rem'
            }}>
              {project.name}
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--ifm-color-emphasis-700)',
              fontSize: '0.85rem',
              lineHeight: 1.4
            }}>
              {project.description}
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {project.links.map((link, linkIndex) => (
            <Link
              key={linkIndex}
              to={link.url}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                background: 'var(--ifm-color-emphasis-100)',
                color: 'var(--ifm-color-emphasis-800)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                position: 'relative',
                zIndex: 2
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ifm-color-emphasis-200)';
                e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {link.label}
              {link.external && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Subtle gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle at top right, ${project.color}10, transparent)`,
          pointerEvents: 'none'
        }}
      />
    </Link>
  );
};

const Misc: React.FC = () => {
  return (
    <Layout title="Misc Projects">
      <div className="container margin-vert--lg">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Side Projects
            </h1>
            <p style={{ 
              fontSize: '0.95rem', 
              color: 'var(--ifm-color-emphasis-600)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              A collection of interesting projects built out of curiosity and passion
            </p>
          </div>

          <section style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '3px',
                height: '20px',
                background: 'var(--ifm-color-primary)',
                borderRadius: '2px'
              }} />
              <h2 style={{ 
                margin: 0,
                fontSize: '1.25rem',
                color: 'var(--ifm-heading-color)'
              }}>
                Browser Extensions
              </h2>
              <div style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                background: 'var(--ifm-color-emphasis-100)',
                borderRadius: '10px',
                color: 'var(--ifm-color-emphasis-600)'
              }}>
                {projects.extensions.length}
              </div>
            </div>
            
            {projects.extensions.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </section>

          <section>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '3px',
                height: '20px',
                background: 'var(--ifm-color-primary)',
                borderRadius: '2px'
              }} />
              <h2 style={{ 
                margin: 0,
                fontSize: '1.25rem',
                color: 'var(--ifm-heading-color)'
              }}>
                Games
              </h2>
              <div style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                background: 'var(--ifm-color-emphasis-100)',
                borderRadius: '10px',
                color: 'var(--ifm-color-emphasis-600)'
              }}>
                {projects.games.length}
              </div>
            </div>
            
            {projects.games.map((project, index) => (
              <ProjectCard key={index} project={project} index={index + projects.extensions.length} />
            ))}
          </section>

          <div style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            padding: '1.25rem',
            background: 'var(--ifm-color-emphasis-100)',
            borderRadius: '8px'
          }}>
            <p style={{ 
              margin: 0,
              color: 'var(--ifm-color-emphasis-700)',
              fontSize: '0.85rem'
            }}>
              More projects coming soon...
            </p>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default Misc;