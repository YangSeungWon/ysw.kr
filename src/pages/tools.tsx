import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const categories = [
  { key: 'all', label: 'All', icon: '⚡' },
  { key: 'image', label: 'Image', icon: '🖼️' },
  { key: 'text', label: 'Text', icon: '📝' },
  { key: 'utility', label: 'Utility', icon: '🔧' },
  { key: 'time', label: 'Time/Date', icon: '⏰' },
  { key: 'audio', label: 'Audio', icon: '🎵' },
];

const tools = [
  {
    to: "/tools/ip",
    name: "IP",
    description: "Get your IP address",
    category: 'utility',
    tags: ['network', 'address'],
  },
  {
    to: "/tools/coordinates",
    name: "Coordinates",
    description: "Get GPS coordinates and convert to multiple formats",
    category: 'utility',
    tags: ['gps', 'location', 'map'],
  },
  {
    to: "/tools/signature",
    name: "Email Signature",
    description: "Generate email signature",
    category: 'text',
    tags: ['email', 'signature'],
  },
  {
    to: "/tools/base64",
    name: "Base64",
    description: "Encode/Decode Base64 with text and images",
    category: 'text',
    tags: ['encode', 'decode', 'base64'],
  },
  {
    to: "/tools/image-crop",
    name: "Image Crop",
    description: "Crop images",
    category: 'image',
    tags: ['crop', 'edit'],
  },
  {
    to: "/tools/emoji",
    name: "Emoji Generator",
    description: "Convert images to Slack/Discord emoji format (transparent background, square, <128KB)",
    category: 'image',
    tags: ['emoji', 'slack', 'discord'],
  },
  {
    to: "/tools/qrcode-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes from images",
    category: 'image',
    tags: ['qr', 'scan', 'decode'],
  },
  {
    to: "/tools/qrcode-generator",
    name: "QR Code Generator",
    description: "Generate QR codes",
    category: 'image',
    tags: ['qr', 'generate', 'encode'],
  },
  {
    to: "/tools/qrcode-multi",
    name: "Multi QR Code Generator",
    description: "Generate multiple QR codes for different fields",
    category: 'image',
    tags: ['qr', 'batch', 'multiple'],
  },
  {
    to: "/tools/image-resizer",
    name: "Image Resizer",
    description: "Resize images by scale factor",
    category: 'image',
    tags: ['resize', 'scale'],
  },
  {
    to: "/tools/color-vision-simulator",
    name: "Color Vision Simulator",
    description: "Simulate how images appear with different color vision deficiencies",
    category: 'image',
    tags: ['color', 'vision', 'accessibility'],
  },
  {
    to: "/tools/audio-checker",
    name: "Audio Checker",
    description: "Check and test connected speakers and microphones",
    category: 'audio',
    tags: ['audio', 'test', 'microphone', 'speaker'],
  },
  {
    to: "/tools/digital-clock",
    name: "Digital Clock",
    description: "Display the current time in different timezones",
    category: 'time',
    tags: ['clock', 'time', 'timezone'],
  },
  {
    to: "/tools/timer-stopwatch",
    name: "Timer/Stopwatch",
    description: "Timer and stopwatch",
    category: 'time',
    tags: ['timer', 'stopwatch', 'countdown'],
  },
  {
    to: "/tools/contact-importer",
    name: "Contact Importer",
    description: "Import spreadsheet contacts to Android (VCF format)",
    category: 'utility',
    tags: ['contact', 'vcf', 'android', 'import'],
  },
  {
    to: "/tools/character-counter",
    name: "Character Counter",
    description: "Count characters, words, lines, and analyze text composition",
    category: 'text',
    tags: ['character', 'word', 'count', 'text', 'analysis'],
  },
];

const Tools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: tools.length };
    tools.forEach(tool => {
      stats[tool.category] = (stats[tool.category] || 0) + 1;
    });
    return stats;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
      // Ctrl/Cmd + G to toggle view mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
      }
      // Number keys to select category
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        if (index < categories.length) {
          setSelectedCategory(categories[index].key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout title="Tools">
      <div className="container margin-vert--lg">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '0.5rem',
            fontFamily: "'Fira Code', 'Consolas', monospace"
          }}>
            <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>$ </span>
            <span className="terminal-text" style={{ 
              background: 'linear-gradient(to right, var(--ifm-color-primary), var(--ifm-color-primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ./developer-tools
            </span>
            <span className="terminal-cursor"></span>
          </h1>
          <p className="terminal-text" style={{ 
            fontSize: '1rem', 
            color: 'var(--ifm-color-emphasis-700)',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: 'var(--ifm-color-success)' }}>→</span> {tools.length} tools loaded • {filteredTools.length} matches
          </p>
          <p className="terminal-text" style={{ 
            fontSize: '0.9rem', 
            color: 'var(--ifm-color-emphasis-600)' 
          }}>
            <span style={{ opacity: 0.7 }}>Shortcuts:</span> <kbd style={{ 
              padding: '2px 6px', 
              background: 'var(--ifm-color-emphasis-200)', 
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
              border: '1px solid var(--ifm-color-emphasis-300)'
            }}>⌘K</kbd> search • <kbd style={{ 
              padding: '2px 6px', 
              background: 'var(--ifm-color-emphasis-200)', 
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
              border: '1px solid var(--ifm-color-emphasis-300)'
            }}>⌘G</kbd> toggle • <kbd style={{ 
              padding: '2px 6px', 
              background: 'var(--ifm-color-emphasis-200)', 
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
              border: '1px solid var(--ifm-color-emphasis-300)'
            }}>1-6</kbd> filter
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          position: 'sticky',
          top: '60px',
          zIndex: 10,
          background: 'var(--ifm-background-color)',
          padding: '1rem 0',
          borderBottom: '1px solid var(--ifm-color-emphasis-200)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map((cat, index) => (
              <button
                key={cat.key}
                className={`button button--sm ${selectedCategory === cat.key ? 'button--primary' : 'button--outline'}`}
                style={{ 
                  minWidth: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedCategory(cat.key)}
                title={`Press ${index + 1} key`}
              >
                <span style={{ fontSize: '1.1em' }}>{cat.icon}</span>
                {cat.label}
                <span style={{ 
                  fontSize: '0.75em', 
                  opacity: 0.7,
                  marginLeft: '0.2rem'
                }}>
                  ({categoryStats[cat.key] || 0})
                </span>
                {index < 6 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '4px',
                    fontSize: '0.7em',
                    opacity: 0.5,
                    fontFamily: 'monospace'
                  }}>
                    {index + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ 
              position: 'relative', 
              flex: 1,
              maxWidth: 400
            }}>
              <input
                type="search"
                placeholder="Search tools, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 2.5rem 0.6rem 1rem',
                  borderRadius: 8,
                  border: '2px solid var(--ifm-color-emphasis-300)',
                  background: 'var(--ifm-background-surface-color)',
                  color: 'var(--ifm-font-color-base)',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--ifm-color-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--ifm-color-emphasis-300)';
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--ifm-color-emphasis-600)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                  }}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                className={`button button--sm ${viewMode === 'grid' ? 'button--primary' : 'button--outline'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view (Ctrl+G)"
                style={{ padding: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                </svg>
              </button>
              <button
                className={`button button--sm ${viewMode === 'list' ? 'button--primary' : 'button--outline'}`}
                onClick={() => setViewMode('list')}
                title="List view (Ctrl+G)"
                style={{ padding: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {search && (
          <div className="terminal-text" style={{ 
            marginBottom: '1rem', 
            padding: '0.5rem 1rem',
            background: 'var(--ifm-color-emphasis-100)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <span style={{ color: 'var(--ifm-color-success)' }}>$</span> grep -i "{search}" tools/* 
            <span style={{ color: 'var(--ifm-color-emphasis-600)', marginLeft: '1rem' }}>
              # {filteredTools.length} match{filteredTools.length !== 1 ? 'es' : ''} found
            </span>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="row">
            {filteredTools.length === 0 ? (
              <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                width: '100%',
                color: 'var(--ifm-color-emphasis-600)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No tools found</p>
                <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredTools.map((tool, idx) => (
                <div key={idx} className="col col--4 margin-bottom--lg">
                  <Link
                    to={tool.to}
                    className="card tool-card-hover"
                    style={{
                      height: '100%',
                      textDecoration: 'none',
                      border: '2px solid var(--ifm-color-emphasis-200)',
                      backgroundColor: 'var(--ifm-card-background-color)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="card__header" style={{ paddingBottom: '0.5rem' }}>
                      <h3 className="terminal-text" style={{ 
                        margin: 0, 
                        fontSize: '1.3rem',
                        color: 'var(--ifm-color-primary)'
                      }}>
                        {tool.name}
                      </h3>
                      <div className="terminal-text" style={{ 
                        fontSize: '0.8rem', 
                        opacity: 0.7,
                        marginTop: '0.25rem',
                        color: 'var(--ifm-color-success)'
                      }}>
                        <span style={{ opacity: 0.5 }}>$</span> {tool.category}
                      </div>
                    </div>
                    <div className="card__body" style={{ flex: 1 }}>
                      <p style={{ 
                        color: 'var(--ifm-color-emphasis-800)',
                        marginBottom: '1rem',
                        lineHeight: 1.5
                      }}>
                        {tool.description}
                      </p>
                      {tool.tags && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.25rem', 
                          flexWrap: 'wrap',
                          marginTop: 'auto'
                        }}>
                          {tool.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                background: 'var(--ifm-color-emphasis-200)',
                                borderRadius: '12px',
                                color: 'var(--ifm-color-emphasis-700)',
                                fontFamily: 'monospace'
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {filteredTools.length === 0 ? (
              <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                color: 'var(--ifm-color-emphasis-600)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No tools found</p>
                <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredTools.map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.to}
                  style={{
                    display: 'block',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '0.75rem',
                    textDecoration: 'none',
                    border: '2px solid var(--ifm-color-emphasis-200)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--ifm-card-background-color)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.25rem',
                        color: 'var(--ifm-color-primary)',
                        marginBottom: '0.25rem'
                      }}>
                        {tool.name}
                        <span style={{ 
                          fontSize: '0.8rem', 
                          opacity: 0.6,
                          marginLeft: '0.5rem',
                          fontFamily: 'monospace',
                          fontWeight: 'normal'
                        }}>
                          /{tool.category}
                        </span>
                      </h3>
                      <p style={{ 
                        color: 'var(--ifm-color-emphasis-700)',
                        margin: '0.5rem 0',
                        lineHeight: 1.5
                      }}>
                        {tool.description}
                      </p>
                      {tool.tags && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.25rem', 
                          flexWrap: 'wrap',
                          marginTop: '0.5rem'
                        }}>
                          {tool.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                background: 'var(--ifm-color-emphasis-200)',
                                borderRadius: '12px',
                                color: 'var(--ifm-color-emphasis-700)',
                                fontFamily: 'monospace'
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{
                      marginLeft: '1rem',
                      color: 'var(--ifm-color-primary)',
                      fontSize: '1.5rem'
                    }}>
                      →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          border: '1px solid var(--ifm-color-emphasis-200)',
          fontFamily: 'monospace'
        }}>
          <div className="terminal-text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--ifm-color-success)' }}>$</span> man developer-tools
          </div>
          <div style={{ 
            marginLeft: '2rem',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--ifm-color-emphasis-700)'
          }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>SYNOPSIS</div>
            <div style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              developer-tools [--search PATTERN] [--view MODE] [--category FILTER]
            </div>
            
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>KEYBOARD SHORTCUTS</div>
            <div style={{ marginLeft: '2rem' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <kbd style={{ 
                  padding: '2px 6px', 
                  background: 'var(--ifm-color-emphasis-200)', 
                  borderRadius: '3px',
                  fontSize: '0.85em',
                  border: '1px solid var(--ifm-color-emphasis-300)'
                }}>Ctrl+K</kbd> <span style={{ marginLeft: '1rem' }}>Focus search input</span>
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <kbd style={{ 
                  padding: '2px 6px', 
                  background: 'var(--ifm-color-emphasis-200)', 
                  borderRadius: '3px',
                  fontSize: '0.85em',
                  border: '1px solid var(--ifm-color-emphasis-300)'
                }}>Ctrl+G</kbd> <span style={{ marginLeft: '1rem' }}>Toggle between grid/list view</span>
              </div>
              <div>
                <kbd style={{ 
                  padding: '2px 6px', 
                  background: 'var(--ifm-color-emphasis-200)', 
                  borderRadius: '3px',
                  fontSize: '0.85em',
                  border: '1px solid var(--ifm-color-emphasis-300)'
                }}>1-6</kbd> <span style={{ marginLeft: '1.5rem' }}>Quick category filter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tools;