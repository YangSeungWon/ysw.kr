import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { ArrowLeft } from 'lucide-react';

interface ToolLayoutProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl';
}

export default function ToolLayout({
    title,
    description,
    icon,
    children,
    maxWidth = 'max-w-5xl'
}: ToolLayoutProps) {
    return (
        <Layout title={title}>
            <div className={`container mx-auto px-4 py-4 ${maxWidth}`}>
                <Link
                    to="/tools"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.875rem',
                        color: 'var(--ifm-color-emphasis-600)',
                        textDecoration: 'none',
                        marginBottom: '1rem',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--ifm-color-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--ifm-color-emphasis-600)';
                    }}
                >
                    <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                    All Tools
                </Link>
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        {icon}
                        <h1 className="text-3xl font-bold text-center" style={{ margin: 0 }}>{title}</h1>
                    </div>
                    {description && (
                        <p className="text-muted-foreground text-center" style={{ margin: '0.25rem 0 0' }}>{description}</p>
                    )}
                </div>
                {children}
            </div>
        </Layout>
    );
}
