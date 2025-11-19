import React from 'react';
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/typography';

interface SectionHeaderProps {
    icon?: React.ReactNode;
    title: string;
    className?: string;
}

export default function SectionHeader({ icon, title, className = '' }: SectionHeaderProps) {
    return (
        <div className={`flex items-center gap-2 mb-6 ${className}`}>
            {icon}
            <h2
                className="text-2xl font-semibold"
                style={{
                    fontSize: FONT_SIZES['2XL'],
                    fontWeight: FONT_WEIGHTS.SEMIBOLD,
                }}
            >
                {title}
            </h2>
        </div>
    );
}
