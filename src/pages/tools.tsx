import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const Tools: React.FC = () => {
  const tools = [
    {
      to: "/tools/ip",
      name: "IP",
      description: "Get your IP address"
    },
    {
      to: "/tools/coordinates",
      name: "Coordinates",
      description: "Get GPS coordinates and convert to multiple formats"
    },
    {
      to: "/tools/signature",
      name: "Email Signature",
      description: "Generate email signature"
    },
    {
      to: "/tools/base64",
      name: "Base64",
      description: "Encode/Decode Base64 with text and images"
    },
    {
      to: "/tools/image-crop",
      name: "Image Crop",
      description: "Crop images"
    },
    {
      to: "/tools/qrcode",
      name: "QR Code",
      description: "Generate QR code"
    },
    {
      to: "/tools/emoji",
      name: "Emoji Generator",
      description: "Convert images to Slack/Discord emoji format (transparent background, square, <128KB)"
    }
  ];

  return (
    <Layout title="Tools">
      <div className="container margin-vert--lg">
        <h1>Tools</h1>
        <div className="row">
          {tools.map((tool, idx) => (
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;