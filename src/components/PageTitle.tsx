import React from 'react';
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/typography';

interface PageTitleProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageTitle({ children, className = '' }: PageTitleProps) {
    return (
        <h1
            className={`text-4xl font-bold mb-8 text-center ${className}`}
            style={{
                fontSize: FONT_SIZES['4XL'],
                fontWeight: FONT_WEIGHTS.BOLD,
                marginBottom: SPACING.XL,
            }}
        >
            {children}
        </h1>
    );
}
