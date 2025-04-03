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
      to: "/tools/emoji",
      name: "Emoji Generator",
      description: "Convert images to Slack/Discord emoji format (transparent background, square, <128KB)"
    },
    {
      to: "/tools/qrcode-scanner",
      name: "QR Code Scanner",
      description: "Scan QR codes from images"
    },
    {
      to: "/tools/qrcode-generator",
      name: "QR Code Generator",
      description: "Generate QR codes"
    },
    {
      to: "/tools/image-resizer",
      name: "Image Resizer",
      description: "Resize images by scale factor"
    },
    {
      to: "/tools/color-vision-simulator",
      name: "Color Vision Simulator",
      description: "Simulate how images appear with different color vision deficiencies"
    },
    {
      to: "/tools/audio-checker",
      name: "Audio Checker",
      description: "Check and test connected speakers and microphones"
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