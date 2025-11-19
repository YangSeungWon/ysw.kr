import React from 'react';
import { FONT_SIZES, SPACING } from '@/constants/typography';
import { BORDER_RADIUS, TRANSITIONS } from '@/constants/styles';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    className?: string;
}

const variantStyles = {
    default: {
        backgroundColor: 'hsl(var(--muted))',
        color: 'hsl(var(--muted-foreground))',
    },
    primary: {
        backgroundColor: 'var(--ifm-color-primary-lightest)',
        color: 'var(--ifm-color-primary-darkest)',
    },
    success: {
        backgroundColor: '#dcfce7',
        color: '#166534',
    },
    warning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },
    danger: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
    },
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2 py-1 ${className}`}
            style={{
                fontSize: FONT_SIZES.XS,
                borderRadius: BORDER_RADIUS.SM,
                transition: TRANSITIONS.DEFAULT,
                ...variantStyles[variant],
            }}
        >
            {children}
        </span>
    );
}
