import React, { useState, useEffect, useRef, type ChangeEvent } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Download, Image, QrCode } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner'
import Layout from '@theme/Layout';

export default function QRCodeGenerator() {
    const [text, setText] = useState("")
    const [debouncedText, setDebouncedText] = useState("")
    const [scannedResult, setScannedResult] = useState("")
    const [isScanning, setIsScanning] = useState(false)
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

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsScanning(true)
        setScannedResult("")

        try {
            const imageUrl = URL.createObjectURL(file)
            const img = document.createElement('img')
            img.crossOrigin = "anonymous"

            img.onload = async () => {
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                canvas.width = img.width
                canvas.height = img.height
                context?.drawImage(img, 0, 0)

                const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)

                if (imageData) {
                    try {
                        const jsQRModule = await import("jsqr")
                        const code = jsQRModule.default(imageData.data, imageData.width, imageData.height)

                        if (code) {
                            setScannedResult(code.data)
                            toast.success("QR Code Scanned")
                        } else {
                            toast.error("No QR Code Found", {
                                description: "The image doesn't contain a valid QR code"
                            })
                        }
                    } catch (jsQRError) {
                        console.error("jsQR error:", jsQRError)
                        toast.error("Scan Failed", {
                            description: "Error processing the QR code"
                        })
                    }
                }

                URL.revokeObjectURL(imageUrl)
                setIsScanning(false)
            }

            img.onerror = () => {
                URL.revokeObjectURL(imageUrl)
                setIsScanning(false)
                toast.error("Image Error", {
                    description: "Failed to load the image"
                })
            }

            img.src = imageUrl
        } catch (error) {
            console.error("File handling error:", error)
            toast.error("Scan Failed", {
                description: "Failed to process the image file"
            })
            setIsScanning(false)
        }
    }

    return (
        <Layout title="QR Code Generator">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">QR Code Tool</h1>
                    </div>
                    <p className="text-muted-foreground text-center">Generate and scan QR codes easily</p>
                </div>

                <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="generate">Generate</TabsTrigger>
                        <TabsTrigger value="scan">Scan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="h-5 w-5" />
                                    Generate QR Code
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium">Enter text for QR code</label>
                                        <Input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Enter URL, text, or contact information..."
                                            className="w-full"
                                        />
                                    </div>

                                    {debouncedText ? (
                                        <div className="flex flex-col items-center pt-4">
                                            <div ref={qrRef} className="border-2 border-primary/10 p-4 bg-white rounded-lg shadow-sm">
                                                <QRCodeSVG value={debouncedText} size={256} level="H" includeMargin={true} />
                                            </div>
                                            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
                                                <Button onClick={copyToClipboard} className="flex-1 gap-2" variant="outline">
                                                    <Copy className="w-4 h-4" />
                                                    Copy to Clipboard
                                                </Button>
                                                <Button onClick={downloadQRCode} className="flex-1 gap-2">
                                                    <Download className="w-4 h-4" />
                                                    Download PNG
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted rounded-lg">
                                            <QrCode className="h-16 w-16 text-muted mb-4" />
                                            <p className="text-muted-foreground text-center">Enter text above to generate a QR code</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="scan">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="h-5 w-5" />
                                    Scan QR Code
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full sm:w-auto gap-2"
                                        disabled={isScanning}
                                    >
                                        <Image className="w-4 h-4" />
                                        {isScanning ? "Scanning..." : "Upload QR Code Image"}
                                    </Button>

                                    {scannedResult && (
                                        <div className="mt-6 w-full">
                                            <Alert className="bg-primary/5 border-primary/20">
                                                <div className="mb-2 font-medium">Scanned Result:</div>
                                                <AlertDescription className="break-all bg-background p-3 rounded border mt-2">
                                                    {scannedResult}
                                                </AlertDescription>
                                            </Alert>

                                            {scannedResult.startsWith("http") && (
                                                <div className="mt-4 flex justify-center">
                                                    <Button onClick={() => window.open(scannedResult, "_blank")} className="gap-2">
                                                        Open Link
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!scannedResult && !isScanning && (
                                        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted rounded-lg mt-6 w-full">
                                            <Image className="h-16 w-16 text-muted mb-4" />
                                            <p className="text-muted-foreground text-center">Upload an image containing a QR code to scan</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
}

