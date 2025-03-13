import React, { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    const [croppedImage, setCroppedImage] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateDisplaySize = useCallback(() => {
        if (imageRef.current) {
            const img = imageRef.current;
            // Get actual rendered size
            const displayWidth = img.width;
            const displayHeight = img.height;

            setImageSize({
                width: displayWidth,
                height: displayHeight
            });
        }
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            updateDisplaySize();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateDisplaySize]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setCrop({
                unit: '%',
                width: 100,
                height: 100,
                x: 0,
                y: 0
            });
            setCroppedImage('');
        };
        reader.readAsDataURL(file);
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        imageRef.current = img;

        // Wait for the next frame to ensure the image is rendered with correct size
        requestAnimationFrame(() => {
            updateDisplaySize();
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = Math.max(1, parseInt(value) || 0);

        // Convert pixel input to percentage based on displayed size
        const percentage = name === 'width'
            ? (numValue / imageSize.width) * 100
            : (numValue / imageSize.height) * 100;

        setCrop(prev => ({
            ...prev,
            unit: '%',
            [name]: Math.min(100, percentage)
        }));
    };

    const getCropPixels = () => {
        // Calculate pixels from percentages based on displayed size
        return {
            width: Math.round((crop.width || 0) * imageSize.width / 100),
            height: Math.round((crop.height || 0) * imageSize.height / 100),
            x: Math.round((crop.x || 0) * imageSize.width / 100),
            y: Math.round((crop.y || 0) * imageSize.height / 100)
        };
    };

    const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<string> => {
        if (!imageSrc) return '';

        // Create new image with original dimensions
        const img = new Image();
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imageSrc;
        });

        // Calculate crop dimensions in pixels from percentages based on original size
        const cropX = Math.round((crop.x! / 100) * img.width);
        const cropY = Math.round((crop.y! / 100) * img.height);
        const cropWidth = Math.round((crop.width! / 100) * img.width);
        const cropHeight = Math.round((crop.height! / 100) * img.height);

        // Create canvas for the cropped portion
        const canvas = document.createElement('canvas');
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingQuality = 'high';

        // Draw the cropped portion
        ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        // Convert to blob and then to data URL
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) throw new Error('Canvas is empty');
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                },
                'image/png',
                1
            );
        });
    };

    const handleCropComplete = useCallback(async (cropResult: Crop) => {
        if (!imageSrc || !cropResult.width || !cropResult.height) return;

        try {
            setProcessing(true);

            const image = new Image();
            image.src = imageSrc;
            await new Promise((resolve) => { image.onload = resolve; });

            const croppedImageUrl = await getCroppedImg(image, cropResult);
            setCroppedImage(croppedImageUrl);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setProcessing(false);
        }
    }, [imageSrc]);

    const downloadImage = () => {
        if (!croppedImage) return;

        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped.png';
        link.click();
    };

    const handleCropChange = (newCrop: Crop) => {
        // Ensure crop always uses percentage
        newCrop.unit = '%';
        setCrop(newCrop);
        handleCropComplete(newCrop);
    };

    return (
        <Layout title="Image Cropper">
            <div className="container" style={{ padding: '20px' }}>
                <h1>Image Cropper</h1>
                <p>Crop images with precise control. Supports transparent backgrounds.</p>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-input"
                    />
                </div>

                {imageSrc && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <h3>Step 1: Crop Image</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ marginRight: '10px' }}>
                                    Width:
                                    <input
                                        type="number"
                                        name="width"
                                        value={getCropPixels().width}
                                        onChange={handleSizeChange}
                                        min="1"
                                        style={{ width: '70px', marginLeft: '5px' }}
                                    />
                                </label>
                                <label>
                                    Height:
                                    <input
                                        type="number"
                                        name="height"
                                        value={getCropPixels().height}
                                        onChange={handleSizeChange}
                                        min="1"
                                        style={{ width: '70px', marginLeft: '5px' }}
                                    />
                                </label>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <button
                                    onClick={() => {
                                        const newCrop: Crop = {
                                            ...crop,
                                            unit: '%' as const,
                                            width: 100,
                                            height: 100
                                        };
                                        setCrop(newCrop);
                                        handleCropComplete(newCrop);
                                    }}
                                    className="button button--secondary"
                                >
                                    Reset to Full Size
                                </button>
                            </div>
                            <div style={{
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                backgroundColor: '#f8f8f8'
                            }} ref={containerRef}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={handleCropChange}
                                    className="image-crop"
                                >
                                    <img
                                        ref={imageRef}
                                        src={imageSrc}
                                        style={{
                                            maxWidth: '100%',
                                            display: 'block'
                                        }}
                                        onLoad={handleImageLoad}
                                    />
                                </ReactCrop>
                            </div>
                            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                Position: X: {getCropPixels().x}, Y: {getCropPixels().y}
                            </p>
                            <p style={{ fontSize: '0.9em', color: '#666' }}>
                                Image size: {imageSize.width} × {imageSize.height}
                            </p>
                        </div>

                        <div>
                            <h3>Step 2: Preview</h3>
                            {processing ? (
                                <p>Processing...</p>
                            ) : croppedImage ? (
                                <>
                                    <div style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#f0f0f0',
                                        padding: '10px',
                                        textAlign: 'center'
                                    }}>
                                        <img
                                            src={croppedImage}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '500px',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                        />
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            onClick={downloadImage}
                                            className="button button--primary"
                                        >
                                            Download Image
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>Loading preview...</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ImageCropper; 