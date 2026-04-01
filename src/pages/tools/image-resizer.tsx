import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import ToolLayout from '@/components/ToolLayout'
import { Toaster } from 'sonner'
import { Label } from "@/components/ui/label"
import { Image, Download } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import ImageDropZone from '@/components/ImageDropZone'

export default function ImageResizer() {
    const [originalImage, setOriginalImage] = useState<string | null>(null)
    const [resizedImage, setResizedImage] = useState<string | null>(null)
    const [scale, setScale] = useState<number>(1)
    const [originalSize, setOriginalSize] = useState<{ width: number; height: number; fileSize: number } | null>(null)
    const [resizedSize, setResizedSize] = useState<{ width: number; height: number; fileSize: number } | null>(null)
    const handleImageFile = (file: File) => {
        const fileSize = file.size
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === 'string') {
                const img = new window.Image()
                img.onload = () => {
                    setOriginalSize({
                        width: img.width,
                        height: img.height,
                        fileSize: fileSize
                    })
                    setOriginalImage(result)
                    handleResize(result, scale, img.width, img.height)
                }
                img.src = result
            }
        }
        reader.readAsDataURL(file)
    }

    const handleResize = (imgSrc: string, scale: number, originalWidth: number, originalHeight: number) => {
        const img = new window.Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const newWidth = Math.round(originalWidth * scale)
            const newHeight = Math.round(originalHeight * scale)

            canvas.width = newWidth
            canvas.height = newHeight

            // 이미지 스무딩 설정
            if (ctx) {
                ctx.imageSmoothingEnabled = true
                // 'low' | 'medium' | 'high' 가능, 대체로 'high'가 가장 선명
                ctx.imageSmoothingQuality = 'high'
            }

            ctx?.drawImage(img, 0, 0, newWidth, newHeight)

            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedDataUrl = canvas.toDataURL('image/png')
                    setResizedImage(resizedDataUrl)
                    setResizedSize({
                        width: newWidth,
                        height: newHeight,
                        fileSize: blob.size,
                    })
                }
            }, 'image/png')
        }
        img.src = imgSrc
    }


    const handleScaleChange = (newScale: number) => {
        setScale(newScale)
        if (originalImage && originalSize) {
            handleResize(originalImage, newScale, originalSize.width, originalSize.height)
        }
    }

    const handleDownload = () => {
        if (!resizedImage) return

        const link = document.createElement('a')
        link.download = 'resized-image.png'
        link.href = resizedImage
        link.click()

        toast.success("Image downloaded")
    }


    return (
        <ToolLayout
            title="Image Resizer"
            description="Resize images by scale factor"
            icon={<Image className="h-8 w-8 text-primary" />}
            maxWidth="max-w-5xl"
        >
            <Toaster />
            <Card className="w-full max-w-[600px] mx-auto">
                    <CardHeader>
                        <CardTitle>Resize Image</CardTitle>
                        <CardDescription>
                            Upload an image and adjust the scale factor
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <ImageDropZone onImageLoad={handleImageFile} />
                        </div>

                        {originalImage && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="scale">Scale Factor (x)</Label>
                                    <div className="flex gap-2">
                                        {[0.25, 0.5, 1, 2, 4].map((s) => (
                                            <Button
                                                key={s}
                                                variant={scale === s ? "default" : "outline"}
                                                onClick={() => handleScaleChange(s)}
                                                className="flex-1"
                                            >
                                                {s}x
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Original</Label>
                                        <div className="border rounded-lg p-2">
                                            <img
                                                src={originalImage}
                                                alt="Original"
                                                className="w-full h-auto"
                                            />
                                            {originalSize && (
                                                <div className="text-sm text-muted-foreground mt-2">
                                                    <p>{originalSize.width} × {originalSize.height}px</p>
                                                    <p>{formatFileSize(originalSize.fileSize)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Resized</Label>
                                        <div className="border rounded-lg p-2">
                                            {resizedImage ? (
                                                <>
                                                    <img
                                                        src={resizedImage}
                                                        alt="Resized"
                                                        className="w-full h-auto"
                                                    />
                                                    {resizedSize && (
                                                        <div className="text-sm text-muted-foreground mt-2">
                                                            <p>{resizedSize.width} × {resizedSize.height}px</p>
                                                            <p>{formatFileSize(resizedSize.fileSize)}</p>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    Select a scale factor
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    {resizedImage && (
                        <CardFooter>
                            <Button onClick={handleDownload} className="w-full gap-2">
                                <Download className="w-4 h-4" />
                                Download Resized Image
                            </Button>
                        </CardFooter>
                    )}
                </Card>
        </ToolLayout>
    )
} 