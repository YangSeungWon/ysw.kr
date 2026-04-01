import { useEffect, useCallback, useRef, useState } from 'react';

interface UseImageInputOptions {
    onImageLoad: (file: File) => void;
    accept?: string;
    disabled?: boolean;
}

interface UseImageInputReturn {
    /** Props to spread on the drop zone container */
    dropZoneProps: {
        onDragOver: (e: React.DragEvent) => void;
        onDragEnter: (e: React.DragEvent) => void;
        onDragLeave: (e: React.DragEvent) => void;
        onDrop: (e: React.DragEvent) => void;
        onPaste: (e: React.ClipboardEvent) => void;
    };
    /** Whether a file is currently being dragged over */
    isDragging: boolean;
    /** Ref for the hidden file input */
    fileInputRef: React.RefObject<HTMLInputElement>;
    /** Open the file picker */
    openFilePicker: () => void;
    /** onChange handler for the hidden file input */
    handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useImageInput({
    onImageLoad,
    accept = 'image/*',
    disabled = false,
}: UseImageInputOptions): UseImageInputReturn {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCountRef = useRef(0);

    const handleFile = useCallback(
        (file: File) => {
            if (disabled) return;
            if (!file.type.startsWith('image/')) return;
            onImageLoad(file);
        },
        [onImageLoad, disabled]
    );

    // Global paste listener
    useEffect(() => {
        const handleGlobalPaste = (e: ClipboardEvent) => {
            if (disabled) return;
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of Array.from(items)) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleFile(file);
                    return;
                }
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => document.removeEventListener('paste', handleGlobalPaste);
    }, [handleFile, disabled]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCountRef.current++;
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCountRef.current--;
        if (dragCountRef.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCountRef.current = 0;
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        },
        [handleFile]
    );

    const onPaste = useCallback(
        (e: React.ClipboardEvent) => {
            // Handled by global listener, but stop propagation
            const items = e.clipboardData.items;
            for (const item of Array.from(items)) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    return;
                }
            }
        },
        []
    );

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset so same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = '';
        },
        [handleFile]
    );

    return {
        dropZoneProps: { onDragOver, onDragEnter, onDragLeave, onDrop, onPaste },
        isDragging,
        fileInputRef,
        openFilePicker,
        handleFileInputChange,
    };
}
