import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { Toaster, toast } from 'sonner';

const COMMON_DELIMITERS = [
  { label: 'New Line', value: '\n' },
  { label: 'Comma', value: ',' },
  { label: 'Tab', value: '\t' },
  { label: 'Space', value: ' ' },
  { label: 'Semicolon', value: ';' },
  { label: 'Pipe', value: '|' },
  { label: 'Colon', value: ':' },
];

export default function TextSplitter(): React.ReactElement {
  const [text, setText] = useState('');
  const [delimiterType, setDelimiterType] = useState<'preset' | 'custom'>('preset');
  const [selectedDelimiter, setSelectedDelimiter] = useState('\n');
  const [customDelimiter, setCustomDelimiter] = useState('');
  const [trimParts, setTrimParts] = useState(true);
  const [filterEmpty, setFilterEmpty] = useState(true);

  const delimiter = delimiterType === 'preset' ? selectedDelimiter : customDelimiter;

  const parts = useMemo(() => {
    if (!text || !delimiter) return [];
    let result = text.split(delimiter);
    if (trimParts) {
      result = result.map(p => p.trim());
    }
    if (filterEmpty) {
      result = result.filter(p => p.length > 0);
    }
    return result;
  }, [text, delimiter, trimParts, filterEmpty]);

  const copyToClipboard = (content: string, index: number) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success(`Copied #${index + 1}`, { duration: 1500 });
    });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      toast.success(`Copied all ${parts.length} items`, { duration: 1500 });
    });
  };

  return (
    <Layout title="Text Splitter">
      <Toaster position="top-center" richColors />
      <div className="container margin-vert--lg" style={{ maxWidth: 900 }}>
        <h1 style={{
          textAlign: 'center',
          color: 'var(--ifm-color-primary)',
          marginBottom: '0.5rem'
        }}>
          Text Splitter
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--ifm-color-emphasis-600)',
          marginBottom: '2rem'
        }}>
          Split text by delimiter and click to copy each part
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Input Section */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: 'var(--ifm-font-color-base)'
            }}>
              Input Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              style={{
                width: '100%',
                minHeight: 150,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-surface-color)',
                color: 'var(--ifm-font-color-base)',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Delimiter Section */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
                color: 'var(--ifm-font-color-base)'
              }}>
                Delimiter
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button
                  className={`button button--sm ${delimiterType === 'preset' ? 'button--primary' : 'button--outline'}`}
                  onClick={() => setDelimiterType('preset')}
                >
                  Preset
                </button>
                <button
                  className={`button button--sm ${delimiterType === 'custom' ? 'button--primary' : 'button--outline'}`}
                  onClick={() => setDelimiterType('custom')}
                >
                  Custom
                </button>
              </div>
              {delimiterType === 'preset' ? (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {COMMON_DELIMITERS.map((d) => (
                    <button
                      key={d.value}
                      className={`button button--sm ${selectedDelimiter === d.value ? 'button--primary' : 'button--outline'}`}
                      onClick={() => setSelectedDelimiter(d.value)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={customDelimiter}
                  onChange={(e) => setCustomDelimiter(e.target.value)}
                  placeholder="Enter custom delimiter..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    backgroundColor: 'var(--ifm-background-surface-color)',
                    color: 'var(--ifm-font-color-base)',
                    fontSize: '0.9rem',
                  }}
                />
              )}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--ifm-font-color-base)'
              }}>
                <input
                  type="checkbox"
                  checked={trimParts}
                  onChange={(e) => setTrimParts(e.target.checked)}
                />
                Trim
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--ifm-font-color-base)'
              }}>
                <input
                  type="checkbox"
                  checked={filterEmpty}
                  onChange={(e) => setFilterEmpty(e.target.checked)}
                />
                Filter Empty
              </label>
            </div>
          </div>

          {/* Results Section */}
          {parts.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontWeight: 500,
                  color: 'var(--ifm-font-color-base)'
                }}>
                  Results ({parts.length} items)
                </span>
                <button
                  className="button button--sm button--primary"
                  onClick={copyAll}
                >
                  Copy All
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {parts.map((part, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(part, idx)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--ifm-color-emphasis-200)',
                      backgroundColor: 'var(--ifm-card-background-color)',
                      color: 'var(--ifm-font-color-base)',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      maxWidth: '100%',
                      wordBreak: 'break-all',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-lightest)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                      e.currentTarget.style.backgroundColor = 'var(--ifm-card-background-color)';
                    }}
                    title="Click to copy"
                  >
                    <span style={{
                      opacity: 0.5,
                      marginRight: '0.5rem',
                      fontSize: '0.75rem'
                    }}>
                      {idx + 1}.
                    </span>
                    {part}
                  </button>
                ))}
              </div>
            </div>
          )}

          {text && delimiter && parts.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--ifm-color-emphasis-600)',
              backgroundColor: 'var(--ifm-card-background-color)',
              borderRadius: '0.5rem',
              border: '1px dashed var(--ifm-color-emphasis-300)',
            }}>
              No results. Try a different delimiter.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
