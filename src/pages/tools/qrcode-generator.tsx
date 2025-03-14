import React, { useState, useEffect, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Download, QrCode } from "lucide-react"
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
    const qrRef = useRef<HTMLDivElement>(null)

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

                <Card className="w-[600px] mx-auto">
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

                        {debouncedText ? (
                            <div className="flex flex-col items-center pt-4">
                                <div ref={qrRef} className="border-2 border-primary/10 p-4 bg-white rounded-lg">
                                    <QRCodeSVG value={debouncedText} size={256} level="H" includeMargin={true} />
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
                        <CardFooter className="flex flex-col sm:flex-row gap-3">
                            <Button onClick={copyToClipboard} className="flex-1 gap-2" variant="outline">
                                <Copy className="w-4 h-4" />
                                Copy to Clipboard
                            </Button>
                            <Button onClick={downloadQRCode} className="flex-1 gap-2">
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