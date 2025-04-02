import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Layout from '@theme/Layout'

type ColorVisionType = 'original' | 'red-variation' | 'green-variation' | 'blue-variation' | 'monochrome'

export function ColorVisionSimulator() {
    const [imageSrc, setImageSrc] = useState<string>("")
    const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9)
    const imageRef = useRef<HTMLImageElement>(null)
    const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({})
    const uploadedFileName = useRef<string>("")

    const handleImageUpload = (file: File) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setImageSrc(reader.result as string)
            uploadedFileName.current = file.name
        }
        reader.readAsDataURL(file)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        handleImageUpload(file)
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile()
                if (file) {
                    handleImageUpload(file)
                    break
                }
            }
        }
    }

    const handleImageLoad = () => {
        if (imageRef.current) {
            const { naturalWidth, naturalHeight } = imageRef.current
            setImageAspectRatio(naturalWidth / naturalHeight)
            simulateAll()
        }
    }

    const simulateColorVision = (type: ColorVisionType) => {
        if (!imageRef.current || !canvasRefs.current[type]) return

        const img = imageRef.current
        const canvas = canvasRefs.current[type]
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        if (type === 'original') return

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            let newR = r
            let newG = g
            let newB = b

            switch (type) {
                case 'red-variation': // Protanopia
                    // Red channel is missing, replaced with green
                    newR = g
                    break
                case 'green-variation': // Deuteranopia
                    // Green channel is missing, replaced with red
                    newG = r
                    break
                case 'blue-variation': // Tritanopia
                    // Blue channel is missing, replaced with red
                    newB = r
                    break
                case 'monochrome': // Achromatopsia
                    // Convert to grayscale using luminance formula
                    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
                    newR = luminance
                    newG = luminance
                    newB = luminance
                    break
            }

            data[i] = newR
            data[i + 1] = newG
            data[i + 2] = newB
        }

        ctx.putImageData(imageData, 0, 0)
    }

    const simulateAll = () => {
        const types: ColorVisionType[] = ['original', 'red-variation', 'green-variation', 'blue-variation', 'monochrome']
        types.forEach(type => simulateColorVision(type))
    }

    useEffect(() => {
        if (imageSrc) {
            simulateAll()
        }
    }, [imageSrc])

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="max-w-md button button--outline button--primary"
                />
                <p className="text-sm text-muted-foreground">
                    Or copy an image to your clipboard and paste it here (Ctrl+V)
                </p>
                <div
                    className="w-full max-w-md h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onPaste={handlePaste}
                >
                    <p className="text-muted-foreground">Paste your image here</p>
                </div>
            </div>

            {imageSrc && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { type: 'original', label: 'Original Image' },
                        { type: 'red-variation', label: 'Protanopia (Red Color Blindness)' },
                        { type: 'green-variation', label: 'Deuteranopia (Green Color Blindness)' },
                        { type: 'blue-variation', label: 'Tritanopia (Blue Color Blindness)' },
                        { type: 'monochrome', label: 'Achromatopsia (Complete Color Blindness)' }
                    ].map(({ type, label }) => (
                        <Card key={type} className="overflow-hidden">
                            <CardContent className="p-2 h-full">
                                <h3 className="text-center mb-2 text-base font-semibold">
                                    {label}
                                </h3>
                                <div
                                    className="flex items-center justify-center bg-gray-50"
                                    style={{
                                        paddingTop: `${(1 / imageAspectRatio) * 100}%`,
                                        position: 'relative'
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {type === 'original' ? (
                                            <img
                                                ref={imageRef}
                                                src={imageSrc}
                                                className="max-w-full max-h-full object-contain"
                                                alt="Original"
                                                onLoad={handleImageLoad}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <canvas
                                                ref={el => canvasRefs.current[type as ColorVisionType] = el}
                                                className="max-w-full max-h-full"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ColorVisionSimulatorPage() {
    return (
        <Layout title="Color Vision Simulator">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-8">Color Vision Simulator</h1>
                <p className="text-center mb-8">
                    Upload an image or paste from clipboard to see how it appears with different types of color vision deficiencies.
                </p>
                <ColorVisionSimulator />
            </div>
        </Layout>
    )
} 