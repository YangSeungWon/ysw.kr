import React from 'react';
import { FileText, Youtube, ExternalLink } from 'lucide-react';
import type { Publication } from '@/data/publications';

interface HomepagePublicationCardProps {
  publication: Publication;
}

export default function HomepagePublicationCard({ publication }: HomepagePublicationCardProps) {
  // Find specific link types (DOI prioritized over PDF/arXiv)
  const youtubeLink = publication.links.find(l => l.type === 'YouTube');
  const paperLink =
    publication.links.find(l => l.type === 'DOI') ||
    publication.links.find(l => l.type === 'PDF') ||
    publication.links.find(l => l.type === 'arXiv');
  const anyLink = publication.links[0];

  return (
    <div className="publication-card">
      {/* Thumbnail */}
      {publication.thumbnail ? (
        <img
          src={publication.thumbnail}
          alt={publication.title}
          className="publication-card-thumbnail"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.parentElement?.querySelector('.publication-card-placeholder') as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className="publication-card-placeholder"
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          display: publication.thumbnail ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--ifm-color-emphasis-100)',
        }}
      >
        <FileText
          style={{
            width: 48,
            height: 48,
            color: 'var(--ifm-color-emphasis-400)'
          }}
        />
      </div>

      {/* Content */}
      <div className="publication-card-content">
        <h3 className="publication-card-title">{publication.title}</h3>
        <p className="publication-card-venue">{publication.venue}</p>

        {publication.award && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--ifm-color-warning-dark)',
            marginBottom: '0.5rem'
          }}>
            {publication.award}
          </div>
        )}

        {/* Action Buttons */}
        <div className="publication-card-actions">
          {paperLink && (
            <a
              href={paperLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="publication-action-btn"
              title="View Paper"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={16} />
              <span>Paper</span>
            </a>
          )}
          {youtubeLink && (
            <a
              href={youtubeLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="publication-action-btn publication-action-btn-video"
              title="Watch Video"
              onClick={(e) => e.stopPropagation()}
            >
              <Youtube size={16} />
              <span>Video</span>
            </a>
          )}
          {!paperLink && !youtubeLink && anyLink && (
            <a
              href={anyLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="publication-action-btn"
              title="View"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
              <span>View</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
