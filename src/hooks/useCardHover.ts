import { useState } from 'react';
import { TRANSITIONS, HOVER_TRANSFORMS } from '@/constants/styles';

interface UseCardHoverOptions {
    scale?: keyof typeof HOVER_TRANSFORMS;
    borderColor?: string;
}

interface CardHoverStyles {
    transform: string;
    transition: string;
    borderColor?: string;
}

export function useCardHover(options: UseCardHoverOptions = {}) {
    const { scale = 'SCALE_MEDIUM', borderColor = 'var(--ifm-color-primary)' } = options;
    const [isHovered, setIsHovered] = useState(false);

    const styles: CardHoverStyles = {
        transform: isHovered ? HOVER_TRANSFORMS[scale] : 'scale(1)',
        transition: TRANSITIONS.DEFAULT,
        ...(borderColor && { borderColor: isHovered ? borderColor : 'hsl(var(--border))' }),
    };

    const handlers = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    return { styles, handlers, isHovered };
}
