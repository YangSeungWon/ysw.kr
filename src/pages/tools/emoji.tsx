import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smile, Download, Upload } from 'lucide-react';
import { toast, Toaster } from 'sonner';

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
                const size = Math.min(image.width, image.height);
                const sourceX = (image.width - size) / 2;
                const sourceY = (image.height - size) / 2;

                ctx.drawImage(
                    image,
                    sourceX, sourceY, size, size,
                    0, 0, targetSize, targetSize
                );
            } else {
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

                        if (blob && blob.size <= 131072) {
                            finalCanvas = canvas;
                            finalBlob = blob;
                            break;
                        }

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
                        toast.success('이미지가 성공적으로 변환되었습니다');
                    } else {
                        setError('이미지를 128KB 이하로 변환할 수 없습니다.');
                        toast.error('이미지를 128KB 이하로 변환할 수 없습니다');
                    }
                };
            };

            reader.readAsDataURL(file);
        } catch (err) {
            setError('이미지 처리 중 오류가 발생했습니다.');
            toast.error('이미지 처리 중 오류가 발생했습니다');
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
            toast.success('이미지 다운로드 완료');
        }
    };

    return (
        <Layout title="Emoji Generator">
            <Toaster />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Smile className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">이모지 생성기</h1>
                    </div>
                    <p className="text-muted-foreground text-center">
                        Slack/Discord 이모지로 사용하기 좋은 형식으로 변환
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>이미지 업로드</CardTitle>
                            <CardDescription>
                                이미지를 업로드하면 자동으로 최적화됩니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                                <p>✓ 512x512px부터 자동 최적화</p>
                                <p>✓ 128KB 이하로 자동 변환</p>
                                <p>✓ 투명 배경 유지</p>
                            </div>

                            <div className="space-y-2">
                                <Label>리사이즈 모드</Label>
                                <RadioGroup
                                    value={resizeMode}
                                    onValueChange={handleResizeModeChange}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="crop" id="crop" />
                                        <Label htmlFor="crop" className="cursor-pointer">중앙 부분 자르기</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fit" id="fit" />
                                        <Label htmlFor="fit" className="cursor-pointer">비율 유지</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>이미지 선택</Label>
                                <Input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {preview && (
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="text-center space-y-3">
                                        <div className="flex justify-center">
                                            <div className="border-2 border-border rounded-lg p-4 bg-white inline-block">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-w-[128px] max-h-[128px]"
                                                />
                                            </div>
                                        </div>
                                        {imageInfo && (
                                            <p className="text-sm text-muted-foreground">
                                                {imageInfo}
                                            </p>
                                        )}
                                        <Button
                                            onClick={handleDownload}
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            다운로드
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default EmojiGenerator;
