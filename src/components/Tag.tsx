import React from 'react';
import { FONT_SIZES } from '@/constants/typography';
import { BORDER_RADIUS, TRANSITIONS } from '@/constants/styles';

interface TagProps {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    className?: string;
}

export default function Tag({ children, onClick, active = false, className = '' }: TagProps) {
    return (
        <span
            onClick={onClick}
            className={`inline-flex items-center px-2 py-1 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            style={{
                fontSize: FONT_SIZES.XS,
                borderRadius: BORDER_RADIUS.SM,
                backgroundColor: active ? 'var(--ifm-color-primary-lightest)' : 'hsl(var(--muted))',
                color: active ? 'var(--ifm-color-primary-darkest)' : 'hsl(var(--muted-foreground))',
                transition: TRANSITIONS.DEFAULT,
                border: active ? '1px solid var(--ifm-color-primary)' : '1px solid transparent',
            }}
        >
            {children}
        </span>
    );
}
