import React, { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Download, QrCode, Image as ImageIcon, Upload, Clipboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import Layout from '@theme/Layout';
import { Toaster } from 'sonner'
import { Label } from "@/components/ui/label"

export default function QRCodeGenerator() {
    const [text, setText] = useState("")
    const [debouncedText, setDebouncedText] = useState("")
    const [centerImage, setCenterImage] = useState("")
    const [showEmoji, setShowEmoji] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedText(text)
        }, 500)

        return () => clearTimeout(timer)
    }, [text])

    const downloadQRCode = () => {
        if (!qrRef.current || !debouncedText) return

        const svg = qrRef.current.querySelector("svg")
        if (!svg) return

        // Create filename from text (limit to 20 chars)
        const cleanText = debouncedText
            .replace(/[^a-zA-Z0-9]/g, "-") // Replace non-alphanumeric with dash
            .replace(/-+/g, "-") // Replace multiple dashes with single dash
            .slice(0, 20) // Limit length
        const filename = `qrcode-${cleanText}.png`

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = document.createElement('img')
        img.crossOrigin = "anonymous"

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)

            const pngFile = canvas.toDataURL("image/png")
            const downloadLink = document.createElement("a")
            downloadLink.download = filename
            downloadLink.href = pngFile
            downloadLink.click()

            toast("QR Code Downloaded", {
                description: `Saved as ${filename}`,
            })
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    const copyToClipboard = async () => {
        if (!qrRef.current || !debouncedText) return

        const svg = qrRef.current.querySelector("svg")
        if (!svg) return

        try {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const img = document.createElement('img')
            img.crossOrigin = "anonymous"

            img.onload = async () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx?.drawImage(img, 0, 0)

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            await navigator.clipboard.write([
                                new ClipboardItem({
                                    "image/png": blob,
                                }),
                            ])
                            toast.success("Copied to clipboard")
                        } catch (err) {
                            toast.error("Failed to copy", {
                                description: "Your browser may not support this feature"
                            })
                        }
                    }
                }, "image/png")
            }

            img.src = "data:image/svg+xml;base64," + btoa(svgData)
        } catch (err) {
            toast.error("Failed to copy", {
                description: "An error occurred while copying the QR code"
            })
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === 'string') {
                setCenterImage(result)
            }
        }
        reader.readAsDataURL(file)
    }

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = Array.from(e.clipboardData.items)

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                if (!file) continue

                const reader = new FileReader()
                reader.onload = (e) => {
                    const result = e.target?.result
                    if (typeof result === 'string') {
                        setCenterImage(result)
                        toast.success("Image pasted successfully")
                    }
                }
                reader.readAsDataURL(file)
                return
            }
        }
    }

    return (
        <Layout title="QR Code Generator">
            <Toaster />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">QR Code Generator</h1>
                    </div>
                    <p className="text-muted-foreground text-center">Generate QR codes easily</p>
                </div>

                <Card className="w-full max-w-[600px] mx-auto">
                    <CardHeader>
                        <CardTitle>Generate QR Code</CardTitle>
                        <CardDescription>
                            Enter text or URL to generate a QR code
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="qr-text">Text for QR code</Label>
                            <Input
                                id="qr-text"
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter URL, text, or contact information..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="center-image">Center Image (Optional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="center-image"
                                    type="text"
                                    value={centerImage}
                                    onChange={(e) => setCenterImage(e.target.value)}
                                    placeholder="Enter emoji or image URL..."
                                    onPaste={handlePaste}
                                    className="flex-1"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Upload image"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        navigator.clipboard.read().then(async (items) => {
                                            for (const item of items) {
                                                const imageType = item.types.find(type => type.startsWith('image/'))
                                                if (imageType) {
                                                    const blob = await item.getType(imageType)
                                                    const reader = new FileReader()
                                                    reader.onload = (e) => {
                                                        const result = e.target?.result
                                                        if (typeof result === 'string') {
                                                            setCenterImage(result)
                                                            toast.success("Image pasted from clipboard")
                                                        }
                                                    }
                                                    reader.readAsDataURL(blob)
                                                    return
                                                }
                                            }
                                            toast.error("No image found in clipboard")
                                        }).catch(() => {
                                            toast.error("Failed to read clipboard")
                                        })
                                    }}
                                    title="Paste from clipboard"
                                >
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enter emoji, image URL, upload a file, or paste from clipboard (Ctrl/Cmd+V)
                            </p>
                            {centerImage && (
                                <Button
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => setCenterImage("")}
                                >
                                    Clear image
                                </Button>
                            )}
                        </div>

                        {debouncedText ? (
                            <div className="flex flex-col items-center pt-4">
                                <div ref={qrRef} className="w-full flex justify-center border-2 border-primary/10 p-4 bg-white rounded-lg">
                                    <QRCodeSVG
                                        value={debouncedText}
                                        size={Math.min(256, window.innerWidth - 100)}
                                        level="H"
                                        includeMargin={true}
                                        imageSettings={centerImage ? {
                                            src: centerImage.length <= 2 ? `data:image/svg+xml,${encodeURIComponent(
                                                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">${centerImage}</text></svg>`
                                            )}` : centerImage,
                                            x: undefined,
                                            y: undefined,
                                            height: 24,
                                            width: 24,
                                            excavate: true,
                                        } : undefined}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted rounded-lg">
                                <QrCode className="h-16 w-16 text-muted mb-4" />
                                <p className="text-muted-foreground text-center">Enter text above to generate a QR code</p>
                            </div>
                        )}
                    </CardContent>
                    {debouncedText && (
                        <CardFooter className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button onClick={copyToClipboard} className="w-full sm:flex-1 gap-2" variant="outline">
                                <Copy className="w-4 h-4" />
                                Copy to Clipboard
                            </Button>
                            <Button onClick={downloadQRCode} className="w-full sm:flex-1 gap-2">
                                <Download className="w-4 h-4" />
                                Download PNG
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </Layout>
    )
} 