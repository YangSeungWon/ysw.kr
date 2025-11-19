import React from 'react';
import { FONT_SIZES, SPACING } from '@/constants/typography';

interface EmptyStateProps {
    icon?: React.ReactNode;
    message: string;
    className?: string;
}

export default function EmptyState({ icon, message, className = '' }: EmptyStateProps) {
    return (
        <div
            className={`text-center py-12 ${className}`}
            style={{
                color: 'hsl(var(--muted-foreground))',
                padding: `${SPACING['3XL']} 0`,
            }}
        >
            {icon && (
                <div className="flex justify-center mb-4">
                    {icon}
                </div>
            )}
            <p style={{ fontSize: FONT_SIZES.LG }}>
                {message}
            </p>
        </div>
    );
}
