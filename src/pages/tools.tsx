import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Image' },
  { key: 'text', label: 'Text' },
  { key: 'utility', label: 'Utility' },
  { key: 'time', label: 'Time/Date' },
  { key: 'audio', label: 'Audio' },
];

const tools = [
  {
    to: "/tools/ip",
    name: "IP",
    description: "Get your IP address",
    category: 'utility',
  },
  {
    to: "/tools/coordinates",
    name: "Coordinates",
    description: "Get GPS coordinates and convert to multiple formats",
    category: 'utility',
  },
  {
    to: "/tools/signature",
    name: "Email Signature",
    description: "Generate email signature",
    category: 'text',
  },
  {
    to: "/tools/base64",
    name: "Base64",
    description: "Encode/Decode Base64 with text and images",
    category: 'text',
  },
  {
    to: "/tools/image-crop",
    name: "Image Crop",
    description: "Crop images",
    category: 'image',
  },
  {
    to: "/tools/emoji",
    name: "Emoji Generator",
    description: "Convert images to Slack/Discord emoji format (transparent background, square, <128KB)",
    category: 'image',
  },
  {
    to: "/tools/qrcode-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes from images",
    category: 'image',
  },
  {
    to: "/tools/qrcode-generator",
    name: "QR Code Generator",
    description: "Generate QR codes",
    category: 'image',
  },
  {
    to: "/tools/qrcode-multi",
    name: "Multi QR Code Generator",
    description: "Generate multiple QR codes for different fields",
    category: 'image',
  },
  {
    to: "/tools/image-resizer",
    name: "Image Resizer",
    description: "Resize images by scale factor",
    category: 'image',
  },
  {
    to: "/tools/color-vision-simulator",
    name: "Color Vision Simulator",
    description: "Simulate how images appear with different color vision deficiencies",
    category: 'image',
  },
  {
    to: "/tools/audio-checker",
    name: "Audio Checker",
    description: "Check and test connected speakers and microphones",
    category: 'audio',
  },
  {
    to: "/tools/digital-clock",
    name: "Digital Clock",
    description: "Display the current time in different timezones",
    category: 'time',
  },
  {
    to: "/tools/timer-stopwatch",
    name: "Timer/Stopwatch",
    description: "Timer and stopwatch",
    category: 'time',
  },
];

const Tools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <Layout title="Tools">
      <div className="container margin-vert--lg">
        <h1>Tools</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`button button--sm ${selectedCategory === cat.key ? 'button--primary' : 'button--secondary'}`}
                style={{ minWidth: 90 }}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 180,
              maxWidth: 320,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid var(--ifm-color-emphasis-200)',
              background: 'var(--ifm-background-surface-color)',
              color: 'var(--ifm-font-color-base)',
            }}
          />
        </div>
        <div className="row">
          {filteredTools.length === 0 ? (
            <div style={{ padding: '2rem', color: 'var(--ifm-color-emphasis-700)' }}>
              No tools found.
            </div>
          ) : (
            filteredTools.map((tool, idx) => (
              <div key={idx} className="col col--4 margin-bottom--lg">
                <Link
                  to={tool.to}
                  className="card padding--sm hover:translate-y-[-4px] transition-all duration-300 hover:shadow-lg"
                  style={{
                    height: '100%',
                    textDecoration: 'none',
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    backgroundColor: 'var(--ifm-card-background-color)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div className="card__header">
                    <h2 className="margin-bottom--sm">{tool.name}</h2>
                  </div>
                  <div className="card__body">
                    <p style={{ color: 'var(--ifm-color-emphasis-900)' }}>
                      {tool.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;