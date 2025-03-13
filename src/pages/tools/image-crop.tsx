import React, { useState, useCallback, useRef, useEffect } from "react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Layout from '@theme/Layout'

export function ImageCropper() {
    const [imageSrc, setImageSrc] = useState<string>("")
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 100,
        height: 100,
        x: 0,
        y: 0,
    })
    const [croppedImage, setCroppedImage] = useState<string>("")
    const [processing, setProcessing] = useState(false)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const updateDisplaySize = useCallback(() => {
        if (imageRef.current) {
            const img = imageRef.current
            // Get actual rendered size
            const displayWidth = img.width
            const displayHeight = img.height

            setImageSize({
                width: displayWidth,
                height: displayHeight,
            })
        }
    }, [])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            updateDisplaySize()
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            resizeObserver.disconnect()
        }
    }, [updateDisplaySize])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setImageSrc(reader.result as string)
            setCrop({
                unit: "%",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
            })
            setCroppedImage("")
        }
        reader.readAsDataURL(file)
    }

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        imageRef.current = img

        // Wait for the next frame to ensure the image is rendered with correct size
        requestAnimationFrame(() => {
            updateDisplaySize()
        })
    }

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const numValue = Math.max(1, Number.parseInt(value) || 0)

        // Convert pixel input to percentage based on displayed size
        const percentage = name === "width" ? (numValue / imageSize.width) * 100 : (numValue / imageSize.height) * 100

        setCrop((prev) => ({
            ...prev,
            unit: "%",
            [name]: Math.min(100, percentage),
        }))
    }

    const getCropPixels = () => {
        // Calculate pixels from percentages based on displayed size
        return {
            width: Math.round(((crop.width || 0) * imageSize.width) / 100),
            height: Math.round(((crop.height || 0) * imageSize.height) / 100),
            x: Math.round(((crop.x || 0) * imageSize.width) / 100),
            y: Math.round(((crop.y || 0) * imageSize.height) / 100),
        }
    }

    const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<string> => {
        if (!imageSrc) return ""

        // Create new image with original dimensions
        const img = new Image()
        img.crossOrigin = "anonymous" // Fix CORS issues
        await new Promise((resolve) => {
            img.onload = resolve
            img.src = imageSrc
        })

        // Calculate crop dimensions in pixels from percentages based on original size
        const cropX = Math.round((crop.x! / 100) * img.width)
        const cropY = Math.round((crop.y! / 100) * img.height)
        const cropWidth = Math.round((crop.width! / 100) * img.width)
        const cropHeight = Math.round((crop.height! / 100) * img.height)

        // Create canvas for the cropped portion
        const canvas = document.createElement("canvas")
        canvas.width = cropWidth
        canvas.height = cropHeight

        const ctx = canvas.getContext("2d")!
        ctx.imageSmoothingQuality = "high"

        // Draw the cropped portion
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

        // Convert to blob and then to data URL
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) throw new Error("Canvas is empty")
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result as string)
                    reader.readAsDataURL(blob)
                },
                "image/png",
                1,
            )
        })
    }

    const handleCropComplete = useCallback(
        async (cropResult: Crop) => {
            if (!imageSrc || !cropResult.width || !cropResult.height) return

            try {
                setProcessing(true)

                const image = new Image()
                image.crossOrigin = "anonymous" // Fix CORS issues
                image.src = imageSrc
                await new Promise((resolve) => {
                    image.onload = resolve
                })

                const croppedImageUrl = await getCroppedImg(image, cropResult)
                setCroppedImage(croppedImageUrl)
            } catch (error) {
                console.error("Error processing image:", error)
            } finally {
                setProcessing(false)
            }
        },
        [imageSrc],
    )

    const downloadImage = () => {
        if (!croppedImage) return

        const link = document.createElement("a")
        link.href = croppedImage
        link.download = "cropped.png"
        link.click()
    }

    const handleCropChange = (newCrop: Crop) => {
        // Ensure crop always uses percentage
        newCrop.unit = "%"
        setCrop(newCrop)
        handleCropComplete(newCrop)
    }

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="max-w-md" />
            </div>

            {imageSrc && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium">Step 1: Crop Image</h3>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center">
                                <span className="mr-2">Width:</span>
                                <Input
                                    type="number"
                                    name="width"
                                    value={getCropPixels().width}
                                    onChange={handleSizeChange}
                                    min="1"
                                    className="w-20"
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">Height:</span>
                                <Input
                                    type="number"
                                    name="height"
                                    value={getCropPixels().height}
                                    onChange={handleSizeChange}
                                    min="1"
                                    className="w-20"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const newCrop: Crop = {
                                        ...crop,
                                        unit: "%",
                                        width: 100,
                                        height: 100,
                                        x: 0,
                                        y: 0,
                                    }
                                    setCrop(newCrop)
                                    handleCropComplete(newCrop)
                                }}
                            >
                                Reset to Full Size
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="p-2">
                                <div ref={containerRef}>
                                    <ReactCrop crop={crop} onChange={handleCropChange}>
                                        <img
                                            ref={imageRef}
                                            src={imageSrc || "/placeholder.svg"}
                                            className="max-w-full block"
                                            onLoad={handleImageLoad}
                                            crossOrigin="anonymous"
                                        />
                                    </ReactCrop>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="text-sm text-muted-foreground">
                            <p>
                                Position: X: {getCropPixels().x}, Y: {getCropPixels().y}
                            </p>
                            <p>
                                Image size: {imageSize.width} × {imageSize.height}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-medium">Step 2: Preview</h3>
                        {processing ? (
                            <div className="flex items-center justify-center h-40">
                                <p>Processing...</p>
                            </div>
                        ) : croppedImage ? (
                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="p-4 flex items-center justify-center bg-muted/20">
                                        <img
                                            src={croppedImage || "/placeholder.svg"}
                                            className="max-w-full max-h-[500px]"
                                            alt="Cropped preview"
                                        />
                                    </CardContent>
                                </Card>
                                <Button onClick={downloadImage}>Download Image</Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-40">
                                <p>Adjust crop to see preview</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ImageCropPage() {
    return (
        <Layout title="Image Crop">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-center">Image Crop Tool</h1>
                </div>
                <ImageCropper />
            </div>
        </Layout>
    )
}

