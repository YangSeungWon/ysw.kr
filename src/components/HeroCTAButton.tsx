import React from 'react';
import Link from '@docusaurus/Link';
import { TRANSITIONS, BORDER_RADIUS } from '@/constants/styles';
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/typography';
import { useCardHover } from '@/hooks/useCardHover';

interface HeroCTAButtonProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary';
}

export default function HeroCTAButton({ to, icon, label, variant = 'primary' }: HeroCTAButtonProps) {
    const { styles, handlers } = useCardHover({ scale: 'SCALE_SMALL' });

    const isPrimary = variant === 'primary';

    return (
        <Link
            to={to}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold no-underline"
            style={{
                backgroundColor: isPrimary ? 'white' : 'transparent',
                color: isPrimary ? 'var(--ifm-color-primary)' : 'white',
                border: isPrimary ? 'none' : '2px solid white',
                fontSize: FONT_SIZES.LG,
                fontWeight: FONT_WEIGHTS.SEMIBOLD,
                padding: `${SPACING.MD} ${SPACING.LG}`,
                borderRadius: BORDER_RADIUS.LG,
                transition: TRANSITIONS.DEFAULT,
                transform: styles.transform,
            }}
            {...handlers}
        >
            {icon}
            {label}
        </Link>
    );
}
