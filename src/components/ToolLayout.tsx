import React from 'react';
import Layout from '@theme/Layout';

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
            <div className={`container mx-auto px-4 py-8 ${maxWidth}`}>
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        {icon}
                        <h1 className="text-3xl font-bold text-center">{title}</h1>
                    </div>
                    {description && (
                        <p className="text-muted-foreground text-center">{description}</p>
                    )}
                </div>
                {children}
            </div>
        </Layout>
    );
}
