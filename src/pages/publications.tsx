import React from 'react';
import Layout from '@theme/Layout';
import { FileText, Youtube, Link as LinkIcon } from 'lucide-react';
import Badge from '@/components/Badge';
import PageTitle from '@/components/PageTitle';
import SectionHeader from '@/components/SectionHeader';
import { TRANSITIONS, BORDER_RADIUS } from '@/constants/styles';
import { FONT_SIZES } from '@/constants/typography';

const publications = [
    {
        id: 'C.1',
        type: 'Conference Paper',
        citation: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang (2025). "Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression". In: Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (ACM CHI 2025).',
        links: [
            { type: 'YouTube', url: 'https://www.youtube.com/watch?v=sT1gxhITWyU' },
            { type: 'DOI', url: 'https://doi.org/10.1145/3706598.3714122' },
            { type: 'PDF', url: 'https://hyojinju.com/files/papers/chi25b-sub9551-cam-i16.pdf' }
        ]
    }
];

const demonstrations = [
    {
        id: 'P.1',
        type: 'Poster',
        citation: '<strong>Seungwon Yang</strong>, Suwon Yoon, Jeongwon Choi, and Inseok Hwang (2025). "Chameleon: A Surface-Anchored Smartphone AR Prototype with Visually Blended Mobile Display". In: Adjunct Proceedings of the 37th Annual ACM Symposium on User Interface Software and Technology (ACM UIST 2025 Poster).',
        links: [
            { type: 'arXiv', url: 'https://arxiv.org/abs/2509.14643' },
            { type: 'DOI', url: 'https://doi.org/10.1145/3746058.3758440' },
            { type: 'Link', url: 'https://programs.sigchi.org/uist/2025/program/content/209506' },
            { type: 'YouTube', url: 'https://www.youtube.com/watch?v=lcBdWX592iQ' }
        ]
    },
    {
        id: 'D.1',
        type: 'Demonstration',
        citation: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang (2025). "Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression". In: Extended Abstracts of the CHI Conference on Human Factors in Computing Systems (ACM CHI 2025 Interactivity).',
        links: [
            { type: 'Link', url: 'https://programs.sigchi.org/chi/2025/program/content/194724' },
        ],
        award: 'Popular Choice Honorable Mention Award'
    },
    {
        id: 'W.1',
        type: 'Workshop Paper',
        citation: 'Suwon Yoon, <strong>Seungwon Yang</strong>, Jeongwon Choi, Wonjeong Park, and Inseok Hwang (2025). "Chatperone: An LLM-Based Negotiable Scaffolding System for Mediating Adolescent Mobile Interactions". In: ACM CHI 2025 Workshop.',
        links: [
            { type: 'arXiv', url: 'https://arxiv.org/abs/2504.17997' },
            { type: 'DOI', url: 'https://doi.org/10.48550/arXiv.2504.17997' }
        ]
    }
];

function PublicationCard({ pub }) {
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