import React from 'react';
import Layout from '@theme/Layout';
import { FileText, Youtube, Link as LinkIcon } from 'lucide-react';
import Badge from '@/components/Badge';
import PageTitle from '@/components/PageTitle';
import SectionHeader from '@/components/SectionHeader';
import { TRANSITIONS, BORDER_RADIUS } from '@/constants/styles';
import { FONT_SIZES } from '@/constants/typography';
import { publications, demonstrations, type Publication } from '@/data/publications';

function PublicationCard({ pub }: { pub: Publication }) {
    return (
        <div className="card padding--lg" style={{
            height: '100%',
            border: '1px solid var(--ifm-color-emphasis-200)',
            backgroundColor: 'var(--ifm-card-background-color)',
            transition: TRANSITIONS.DEFAULT,
        }}>
            <div className="flex items-center justify-between margin-bottom--sm">
                <Badge variant="primary">{pub.type}</Badge>
                <span className="text-sm font-medium" style={{
                    color: 'var(--ifm-color-emphasis-600)',
                    fontSize: FONT_SIZES.SM
                }}>
                    {pub.id}
                </span>
            </div>

            <p className="margin-bottom--md" style={{ color: 'var(--ifm-color-emphasis-900)' }} dangerouslySetInnerHTML={{ __html: pub.citation }} />

            {pub.award && (
                <div className="margin-bottom--md">
                    <Badge variant="warning">🏆 {pub.award}</Badge>
                </div>
            )}

            {pub.links && (
                <div className="flex flex-wrap gap-2">
                    {pub.links.map((link, linkIndex) => (
                        <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium"
                            style={{
                                backgroundColor: 'var(--ifm-color-primary-lightest)',
                                color: 'var(--ifm-color-primary-dark)',
                                border: '1px solid var(--ifm-color-primary-lighter)',
                                textDecoration: 'none',
                                transition: TRANSITIONS.DEFAULT,
                                borderRadius: BORDER_RADIUS.SM,
                                fontSize: FONT_SIZES.XS,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-lighter)';
                                e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-lightest)';
                                e.currentTarget.style.borderColor = 'var(--ifm-color-primary-lighter)';
                            }}
                        >
                            {link.type === 'YouTube' && <Youtube className="w-4 h-4 margin-right--xs" />}
                            {link.type === 'PDF' && <FileText className="w-4 h-4 margin-right--xs" />}
                            {link.type === 'DOI' && <LinkIcon className="w-4 h-4 margin-right--xs" />}
                            {link.type === 'arXiv' && <LinkIcon className="w-4 h-4 margin-right--xs" />}
                            {link.type === 'Link' && <LinkIcon className="w-4 h-4 margin-right--xs" />}
                            {link.type}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Publications(): JSX.Element {
    return (
        <Layout title="Publications" description="Research Publications">
            <div className="container margin-vert--lg">
                <PageTitle>Publications</PageTitle>

                {/* Conference Papers Section */}
                <div className="margin-bottom--xl">
                    <SectionHeader title="Conference Papers" />
                    <div className="row">
                        {publications.map((pub) => (
                            <div key={pub.id} className="col col--12 margin-bottom--lg">
                                <PublicationCard pub={pub} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demonstrations and Extended Abstracts Section */}
                <div>
                    <SectionHeader title="Demonstrations and Extended Abstracts" />
                    <div className="row">
                        {demonstrations.map((pub) => (
                            <div key={pub.id} className="col col--12 margin-bottom--lg">
                                <PublicationCard pub={pub} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
} 