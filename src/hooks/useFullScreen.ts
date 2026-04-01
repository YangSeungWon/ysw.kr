import { useState, useCallback, useEffect, useRef } from 'react';

interface UseFullScreenReturn {
    isFullScreen: boolean;
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    toggleFullScreen: () => void;
    fullScreenRef: React.RefObject<HTMLDivElement>;
}

export function useFullScreen(): UseFullScreenReturn {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const fullScreenRef = useRef<HTMLDivElement>(null);

    const enterFullScreen = useCallback(() => {
        const el = fullScreenRef.current;
        if (el?.requestFullscreen) {
            el.requestFullscreen().catch(() => {
                // Fallback: use CSS fullscreen
                setIsFullScreen(true);
            });
        } else {
            setIsFullScreen(true);
        }
    }, []);

    const exitFullScreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {
                setIsFullScreen(false);
            });
        } else {
            setIsFullScreen(false);
        }
    }, []);

    const toggleFullScreen = useCallback(() => {
        if (isFullScreen || document.fullscreenElement) {
            exitFullScreen();
        } else {
            enterFullScreen();
        }
    }, [isFullScreen, enterFullScreen, exitFullScreen]);

    // Sync state with browser fullscreen events
    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    // ESC key fallback for CSS fullscreen
    useEffect(() => {
        if (!isFullScreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !document.fullscreenElement) {
                setIsFullScreen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFullScreen]);

    return {
        isFullScreen,
        enterFullScreen,
        exitFullScreen,
        toggleFullScreen,
        fullScreenRef,
    };
}
