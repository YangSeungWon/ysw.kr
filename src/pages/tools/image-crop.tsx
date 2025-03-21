import React, { useState, useCallback, useRef, useEffect } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Layout from '@theme/Layout'

const DEFAULT_CROP: Crop = {
    unit: 'px',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
}

export function ImageCropper() {
    const [imageSrc, setImageSrc] = useState<string>("")
    const [crop, setCrop] = useState<Crop>(DEFAULT_CROP)
    const [croppedImage, setCroppedImage] = useState<string>("")
    const imageRef = useRef<HTMLImageElement>(null)
    const [displaySize, setDisplaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
    const cropTimeoutRef = useRef<NodeJS.Timeout>()
    const [croppedSize, setCroppedSize] = useState({ width: 0, height: 0 })
    const uploadedFileName = useRef<string>("")

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setImageSrc(reader.result as string)
            setCrop(DEFAULT_CROP)
            setCroppedImage(reader.result as string)
            uploadedFileName.current = file.name
        }
        reader.readAsDataURL(file)
    }

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        const { naturalWidth, naturalHeight, width, height } = img
        const boxSize = width / 5

        setDisplaySize({ width, height })

        const initialCrop = {
            unit: 'px',
            width: boxSize,
            height: boxSize,
            x: width / 2 - boxSize / 2,
            y: height / 2 - boxSize / 2
        }
        setCrop(initialCrop as Crop)
        handleCropComplete(initialCrop as Crop)
    }

    const getCroppedImg = useCallback(async (crop: Crop): Promise<{ dataUrl: string, width: number, height: number }> => {
        if (!imageSrc || !imageRef.current) return { dataUrl: "", width: 0, height: 0 }

        const img = imageRef.current
        const { naturalWidth, naturalHeight } = img

        const scaleX = naturalWidth / displaySize.width
        const scaleY = naturalHeight / displaySize.height

        const realCropWidth = (crop.width || 0) * scaleX
        const realCropHeight = (crop.height || 0) * scaleY

        const canvas = document.createElement("canvas")
        canvas.width = realCropWidth
        canvas.height = realCropHeight

        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Failed to get canvas context")

        ctx.drawImage(
            img,
            (crop.x || 0) * scaleX,
            (crop.y || 0) * scaleY,
            realCropWidth,
            realCropHeight,
            0,
            0,
            realCropWidth,
            realCropHeight
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return
                const reader = new FileReader()
                reader.onloadend = () => resolve({
                    dataUrl: reader.result as string,
                    width: crop.width || 0,
                    height: crop.height || 0
                })
                reader.readAsDataURL(blob)
            }, "image/png")
        })
    }, [imageSrc, displaySize])

    const handleCropComplete = useCallback(async (cropResult: Crop) => {
        if (!imageSrc || !cropResult.width || !cropResult.height) return
        const result = await getCroppedImg(cropResult)
        setCroppedImage(result.dataUrl)
        setCroppedSize({ width: result.width, height: result.height })
    }, [imageSrc, getCroppedImg])

    const debouncedCropComplete = useCallback((cropResult: Crop) => {
        if (cropTimeoutRef.current) {
            clearTimeout(cropTimeoutRef.current)
        }

        cropTimeoutRef.current = setTimeout(() => {
            handleCropComplete(cropResult)
        }, 500)
    }, [handleCropComplete])

    const handleCropChange = (newCrop: Crop) => {
        setCrop(newCrop)
        debouncedCropComplete(newCrop)
    }

    const handleDownload = () => {
        if (!croppedImage) return
        const link = document.createElement('a')
        link.href = croppedImage
        link.download = `${uploadedFileName.current}-cropped-${Date.now()}.png`
        link.click()
    }

    const handleFullSize = () => {
        if (!imageRef.current) return
        const { width, height } = imageRef.current
        const newCrop = {
            unit: 'px',
            width,
            height,
            x: 0,
            y: 0
        } as Crop
        setCrop(newCrop)
        handleCropComplete(newCrop)
    }

    const handleReset = () => {
        if (!imageRef.current) return
        const { width, height } = imageRef.current
        const boxSize = width / 5
        const newCrop = {
            unit: 'px',
            width: boxSize,
            height: boxSize,
            x: width / 2 - boxSize / 2,
            y: height / 2 - boxSize / 2
        } as Crop
        setCrop(newCrop)
        handleCropComplete(newCrop)
    }

    useEffect(() => {
        return () => {
            if (cropTimeoutRef.current) {
                clearTimeout(cropTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="space-y-6">
            <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-md button button--outline button--primary"
            />

            {imageSrc && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="p-2">
                                <ReactCrop
                                    crop={crop}
                                    onChange={handleCropChange}
                                    minWidth={10}
                                    minHeight={10}
                                >
                                    <img
                                        ref={imageRef}
                                        src={imageSrc}
                                        className="max-w-full"
                                        alt="Source"
                                        onLoad={handleImageLoad}
                                    />
                                </ReactCrop>
                            </CardContent>
                        </Card>
                        <div className="flex items-center justify-between gap-2">
                            <Button onClick={handleReset} className="button button--outline button--secondary">Reset</Button>
                            <Button onClick={handleFullSize} className="button button--outline button--secondary">Full Size</Button>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>Display crop: {Math.round(crop.width || 0)} × {Math.round(crop.height || 0)} px</div>
                                {imageRef.current && (
                                    <>
                                        <div>Display size: {displaySize.width} × {displaySize.height} px</div>
                                        <div>Original size: {imageRef.current.naturalWidth} × {imageRef.current.naturalHeight} px</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {croppedImage && (
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-2">
                                    <img
                                        src={croppedImage}
                                        style={{
                                            width: croppedSize.width,
                                            height: croppedSize.height,
                                        }}
                                        alt="Preview"
                                    />
                                </CardContent>
                            </Card>
                            <Button onClick={handleDownload} className="button button--outline button--primary">Download</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function ImageCropPage() {
    return (
        <Layout title="Image Crop">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-3xl font-bold text-center mb-8">Image Crop Tool</h1>
                <ImageCropper />
            </div>
        </Layout>
    )
}

