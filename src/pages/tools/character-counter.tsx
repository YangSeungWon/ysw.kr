import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';

const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    const bytes = new Blob([text]).size;
    const koreanChars = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const punctuation = (text.match(/[.,;:!?'"()\[\]{}\-_/\\@#$%^&*+=`~<>|]/g) || []).length;

    return {
      chars,
      charsNoSpaces,
      words,
      lines,
      paragraphs,
      bytes,
      koreanChars,
      englishChars,
      numbers,
      spaces,
      punctuation,
    };
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <Layout title="Character Counter">
      <div className="container margin-vert--lg">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          fontFamily: "'Fira Code', 'Consolas', monospace"
        }}>
          <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>$ </span>
          <span className="terminal-text" style={{ 
            background: 'linear-gradient(to right, var(--ifm-color-primary), var(--ifm-color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            character-counter
          </span>
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--ifm-color-emphasis-700)',
          marginBottom: '2rem'
        }}>
          Count characters, words, lines, and more
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '0.5rem',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ 
              fontWeight: 600,
              fontSize: '1rem'
            }}>
              Enter your text:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="button button--sm button--outline"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                📋 Paste
              </button>
              <button
                className="button button--sm button--outline"
                onClick={handleCopy}
                disabled={!text}
                title="Copy to clipboard"
              >
                📝 Copy
              </button>
              <button
                className="button button--sm button--outline"
                onClick={handleClear}
                disabled={!text}
                title="Clear text"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '1rem',
              fontSize: '1rem',
              fontFamily: 'monospace',
              border: '2px solid var(--ifm-color-emphasis-300)',
              borderRadius: '8px',
              backgroundColor: 'var(--ifm-background-surface-color)',
              color: 'var(--ifm-font-color-base)',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-color-primary-lightest)',
            border: '2px solid var(--ifm-color-primary-light)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-primary-darker)'
            }}>
              Characters
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--ifm-color-primary)'
            }}>
              {stats.chars.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-background-surface-color)',
            border: '2px solid var(--ifm-color-emphasis-200)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              Characters (no spaces)
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {stats.charsNoSpaces.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-background-surface-color)',
            border: '2px solid var(--ifm-color-emphasis-200)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              Words
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {stats.words.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-background-surface-color)',
            border: '2px solid var(--ifm-color-emphasis-200)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              Lines
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {stats.lines.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-background-surface-color)',
            border: '2px solid var(--ifm-color-emphasis-200)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              Paragraphs
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {stats.paragraphs.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ 
            padding: '1.5rem',
            backgroundColor: 'var(--ifm-background-surface-color)',
            border: '2px solid var(--ifm-color-emphasis-200)'
          }}>
            <h3 style={{ 
              fontSize: '1rem',
              marginBottom: '0.5rem',
              color: 'var(--ifm-color-emphasis-700)'
            }}>
              Bytes
            </h3>
            <div style={{ 
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {stats.bytes.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--ifm-background-surface-color)',
          border: '2px solid var(--ifm-color-emphasis-200)',
          borderRadius: '8px'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: 'var(--ifm-heading-color)'
          }}>
            Detailed Analysis
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-600)',
                marginBottom: '0.25rem'
              }}>
                Korean
              </div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-primary)'
              }}>
                {stats.koreanChars.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-600)',
                marginBottom: '0.25rem'
              }}>
                English
              </div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-primary)'
              }}>
                {stats.englishChars.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-600)',
                marginBottom: '0.25rem'
              }}>
                Numbers
              </div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-primary)'
              }}>
                {stats.numbers.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-600)',
                marginBottom: '0.25rem'
              }}>
                Spaces
              </div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-primary)'
              }}>
                {stats.spaces.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-600)',
                marginBottom: '0.25rem'
              }}>
                Punctuation
              </div>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--ifm-color-primary)'
              }}>
                {stats.punctuation.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.03)',
          borderRadius: '8px',
          border: '1px solid var(--ifm-color-emphasis-200)',
          fontFamily: 'monospace',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: 'var(--ifm-color-emphasis-600)' }}>
            <span style={{ color: 'var(--ifm-color-success)' }}>$</span> echo "Character counting tool" | wc -c
          </div>
          <div style={{ marginLeft: '1rem', marginTop: '0.5rem', color: 'var(--ifm-color-emphasis-500)' }}>
            # Count characters, words, lines, paragraphs, and more
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CharacterCounter;