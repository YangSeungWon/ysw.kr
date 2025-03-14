import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type ResizeMode = 'crop' | 'fit';

const EmojiGenerator: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageInfo, setImageInfo] = useState<string | null>(null);
    const [resizeMode, setResizeMode] = useState<ResizeMode>('crop');
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentFile) {
            processImage(currentFile);
        }
    }, [resizeMode, currentFile]);

    const resizeImage = async (
        image: HTMLImageElement,
        targetSize: number,
        mode: ResizeMode
    ): Promise<HTMLCanvasElement> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = targetSize;
        canvas.height = targetSize;

        if (ctx) {
            ctx.clearRect(0, 0, targetSize, targetSize);

            if (mode === 'crop') {
                // 중앙 부분을 잘라서 정사각형으로 만들기
                const size = Math.min(image.width, image.height);
                const sourceX = (image.width - size) / 2;
                const sourceY = (image.height - size) / 2;

                ctx.drawImage(
                    image,
                    sourceX, sourceY, size, size,  // 소스 영역
                    0, 0, targetSize, targetSize   // 대상 영역
                );
            } else {
                // 비율 유지하며 맞추기
                const scale = targetSize / Math.max(image.width, image.height);
                const scaledWidth = image.width * scale;
                const scaledHeight = image.height * scale;
                const offsetX = (targetSize - scaledWidth) / 2;
                const offsetY = (targetSize - scaledHeight) / 2;

                ctx.drawImage(
                    image,
                    offsetX, offsetY,
                    scaledWidth, scaledHeight
                );
            }
        }

        return canvas;
    };

    const processImage = async (file: File) => {
        try {
            const image = new Image();
            const reader = new FileReader();

            reader.onload = async (e) => {
                image.src = e.target?.result as string;
                image.onload = async () => {
                    // 더 큰 사이즈부터 점진적으로 시도
                    const sizesToTry = [
                        512, 448, 384, 320,
                        256, 224, 192, 160,
                        128, 112, 96, 80,
                        64, 56, 48, 40, 32
                    ];
                    let finalCanvas: HTMLCanvasElement | null = null;
                    let finalBlob: Blob | null = null;

                    for (const size of sizesToTry) {
                        const canvas = await resizeImage(image, size, resizeMode);
                        const blob = await new Promise<Blob | null>((resolve) => {
                            canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
                        });

                        if (blob && blob.size <= 131072) { // 128KB
                            finalCanvas = canvas;
                            finalBlob = blob;
                            break;
                        }

                        // 마지막 시도에서도 파일이 너무 큰 경우, 품질을 낮춰서 시도
                        if (size === sizesToTry[sizesToTry.length - 1] && blob) {
                            let quality = 0.9;
                            while (quality > 0.1) {
                                const compressedBlob = await new Promise<Blob | null>((resolve) => {
                                    canvas.toBlob((b) => resolve(b), 'image/png', quality);
                                });

                                if (compressedBlob && compressedBlob.size <= 131072) {
                                    finalCanvas = canvas;
                                    finalBlob = compressedBlob;
                                    break;
                                }
                                quality -= 0.1;
                            }
                        }
                    }

                    if (finalCanvas && finalBlob) {
                        const imageUrl = URL.createObjectURL(finalBlob);
                        setPreview(imageUrl);

                        const fileSize = (finalBlob.size / 1024).toFixed(1);
                        const pixelSize = finalCanvas.width;
                        setImageInfo(`${pixelSize}x${pixelSize}px, ${fileSize}KB`);
                        setError(null);
                    } else {
                        setError('이미지를 128KB 이하로 변환할 수 없습니다.');
                    }
                };
            };

            reader.readAsDataURL(file);
        } catch (err) {
            setError('이미지 처리 중 오류가 발생했습니다.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCurrentFile(file);
            processImage(file);
        }
    };

    const handleResizeModeChange = (value: string) => {
        setResizeMode(value as ResizeMode);
    };

    const handleDownload = () => {
        if (preview) {
            const link = document.createElement('a');
            link.download = 'emoji.png';
            link.href = preview;
            link.click();
        }
    };

    return (
        <Layout title="Emoji Generator">
            <div className="container margin-vert--lg">
                <h1>이모지 생성기</h1>
                <div className="row">
                    <div className="col col--6 col--offset-3">
                        <div className="card padding--lg">
                            <p>
                                Slack/Discord 이모지로 사용하기 좋은 이미지 형식으로 변환합니다.
                                <br />
                                - 512x512px부터 자동 최적화
                                <br />
                                - 128KB 이하로 자동 변환
                                <br />
                                - 투명 배경 유지
                            </p>

                            <div className="margin-bottom--md">
                                <Label className="block margin-bottom--sm">리사이즈 모드</Label>
                                <RadioGroup
                                    value={resizeMode}
                                    onValueChange={handleResizeModeChange}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="crop" id="crop" />
                                        <Label htmlFor="crop">중앙 부분 자르기</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fit" id="fit" />
                                        <Label htmlFor="fit">비율 유지</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="margin-bottom--md button button--outline button--primary"
                            />

                            {error && (
                                <div className="alert alert--danger margin-bottom--md">
                                    {error}
                                </div>
                            )}

                            {preview && (
                                <div className="text--center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '128px',
                                            maxHeight: '128px',
                                            margin: '1rem 0'
                                        }}
                                    />
                                    {imageInfo && (
                                        <div className="margin-bottom--sm">
                                            {imageInfo}
                                        </div>
                                    )}
                                    <div>
                                        <Button
                                            className="button button--primary"
                                            onClick={handleDownload}
                                        >
                                            다운로드
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmojiGenerator;
