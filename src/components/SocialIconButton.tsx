import React from 'react';
import { TRANSITIONS, HOVER_TRANSFORMS, BORDER_RADIUS } from '@/constants/styles';
import { useCardHover } from '@/hooks/useCardHover';

interface SocialIconButtonProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

export default function SocialIconButton({ href, icon, label }: SocialIconButtonProps) {
    const { styles, handlers } = useCardHover({ scale: 'SCALE_SMALL' });

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
            style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: BORDER_RADIUS.XL,
                transition: TRANSITIONS.DEFAULT,
                transform: styles.transform,
            }}
            {...handlers}
        >
            {icon}
        </a>
    );
}
