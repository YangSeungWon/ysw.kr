import React from 'react';
import Layout from '@theme/Layout';
import { FileText, Youtube, Link as LinkIcon } from 'lucide-react';

const publications = [
    {
        id: 'P.1',
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
        id: 'D.1',
        type: 'Demonstration',
        citation: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang (2025). "Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression". In: Extended Abstracts of the CHI Conference on Human Factors in Computing Systems (ACM CHI 2025 Interactivity).'
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {pub.type}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {pub.id}
                </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: pub.citation }} />

            {pub.links && (
                <div className="flex flex-wrap gap-3">
                    {pub.links.map((link, linkIndex) => (
                        <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                                     bg-gray-100 text-gray-700 hover:bg-gray-200
                                     dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            {link.type === 'YouTube' && <Youtube className="w-4 h-4 mr-1" />}
                            {link.type === 'PDF' && <FileText className="w-4 h-4 mr-1" />}
                            {link.type === 'DOI' && <LinkIcon className="w-4 h-4 mr-1" />}
                            {link.type === 'arXiv' && <LinkIcon className="w-4 h-4 mr-1" />}
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
            <main className="min-h-screen py-12 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Publications
                    </h1>

                    {/* Conference Papers Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            Conference Papers
                        </h2>
                        <div className="space-y-8">
                            {publications.map((pub) => (
                                <PublicationCard key={pub.id} pub={pub} />
                            ))}
                        </div>
                    </div>

                    {/* Demonstrations and Extended Abstracts Section */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            Demonstrations and Extended Abstracts
                        </h2>
                        <div className="space-y-8">
                            {demonstrations.map((pub) => (
                                <PublicationCard key={pub.id} pub={pub} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
} 