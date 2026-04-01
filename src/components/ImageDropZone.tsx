import React from 'react';
import { Upload } from 'lucide-react';
import { useImageInput } from '@/hooks/useImageInput';

interface ImageDropZoneProps {
    onImageLoad: (file: File) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function ImageDropZone({ onImageLoad, disabled, children, className = '' }: ImageDropZoneProps) {
    const { dropZoneProps, isDragging, fileInputRef, openFilePicker, handleFileInputChange } =
        useImageInput({ onImageLoad, disabled });

    if (children) {
        return (
            <div {...dropZoneProps} className={className}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                />
                {children}
            </div>
        );
    }

    return (
        <div
            {...dropZoneProps}
            onClick={openFilePicker}
            className={className}
            style={{
                border: `2px dashed ${isDragging ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}`,
                borderRadius: '0.5rem',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: disabled ? 'default' : 'pointer',
                background: isDragging ? 'var(--ifm-color-primary-lightest)' : 'transparent',
                transition: 'all 0.2s ease',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />
            <Upload
                style={{
                    width: '2rem',
                    height: '2rem',
                    margin: '0 auto 0.5rem',
                    color: isDragging ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-500)',
                }}
            />
            <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: isDragging ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-600)',
            }}>
                {isDragging ? 'Drop image here' : 'Drag & drop, click to upload, or paste (Ctrl+V)'}
            </p>
        </div>
    );
}
