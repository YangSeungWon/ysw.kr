import { useState } from 'react';
import { TRANSITIONS, HOVER_TRANSFORMS, SHADOWS } from '@/constants/styles';

interface UseCardHoverOptions {
    scale?: keyof typeof HOVER_TRANSFORMS;
    borderColor?: string;
    shadow?: keyof typeof SHADOWS | string;
    lift?: boolean;
}

interface CardHoverStyles {
    transform: string;
    transition: string;
    borderColor?: string;
    boxShadow?: string;
}

export function useCardHover(options: UseCardHoverOptions = {}) {
    const {
        scale = 'SCALE_MEDIUM',
        borderColor = 'var(--ifm-color-primary)',
        shadow = 'LG',
        lift = true,
    } = options;
    const [isHovered, setIsHovered] = useState(false);

    const getShadow = () => {
        if (!shadow) return undefined;
        if (shadow in SHADOWS) return SHADOWS[shadow as keyof typeof SHADOWS];
        return shadow;
    };

    const getTransform = () => {
        if (!isHovered) return 'scale(1) translateY(0)';
        const scaleValue = HOVER_TRANSFORMS[scale];
        const liftValue = lift ? 'translateY(-4px)' : 'translateY(0)';
        return `${scaleValue} ${liftValue}`;
    };

    const styles: CardHoverStyles = {
        transform: getTransform(),
        transition: TRANSITIONS.SLOW,
        ...(borderColor && { borderColor: isHovered ? borderColor : 'var(--ifm-color-emphasis-200)' }),
        ...(shadow && { boxShadow: isHovered ? getShadow() : 'none' }),
    };

    const handlers = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return { styles, handlers, isHovered };
}
