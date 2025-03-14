import React, { useState, useRef, type ChangeEvent } from "react"
import { Image, QrCode } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner'
import Layout from '@theme/Layout';
import { Toaster } from 'sonner'
import jsQR from 'jsqr'

export default function QRCodeScanner() {
    const [scannedResult, setScannedResult] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error("Invalid File Type", {
                description: "Please upload an image file"
            })
            return
        }

        setIsScanning(true)
        setScannedResult("")

        try {
            const imageUrl = URL.createObjectURL(file)
            setUploadedImage(imageUrl)
            const img = document.createElement('img')
            img.crossOrigin = "anonymous"

            img.onload = () => {
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d")
                if (!context) {
                    throw new Error("Could not get canvas context")
                }

                canvas.width = img.width
                canvas.height = img.height
                context.drawImage(img, 0, 0)

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                const code = jsQR(imageData.data, imageData.width, imageData.height)

                if (code) {
                    setScannedResult(code.data)
                    toast.success("QR Code Scanned", {
                        description: "The QR code was successfully scanned."
                    })
                } else {
                    toast.error("No QR Code Found", {
                        description: "The image doesn't contain a valid QR code"
                    })
                }

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
                description: "Failed to process the image file. Please try again with a different image."
            })
            setIsScanning(false)
        }
    }

    return (
        <Layout title="QR Code Scanner">
            <Toaster />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">QR Code Scanner</h1>
                    </div>
                </div>

                <Card className="w-full max-w-[600px] mx-auto">
                    <CardHeader>
                        <CardTitle>Scan QR Code</CardTitle>
                        <CardDescription>
                            Upload an image containing a QR code to scan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full max-w-[256px] h-12 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                                style={{
                                    backgroundColor: "var(--ifm-color-primary-lightest)",
                                    color: "black",
                                }}
                                disabled={isScanning}
                                size="lg"
                            >
                                <Image className="w-5 h-5 mr-2" />
                                {isScanning ? "Scanning..." : "Upload QR Code"}
                            </Button>

                            {scannedResult && (
                                <div className="w-full">
                                    <div className="mb-2 font-medium">Scanned Result:</div>
                                    <AlertDescription className="bg-primary/5 border-primary/20 break-all bg-background p-3 rounded border mt-2 font-mono text-lg">
                                        {scannedResult}
                                    </AlertDescription>
                                </div>
                            )}

                            {uploadedImage && (
                                <div className="mt-4 w-full flex justify-center">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded QR Code"
                                        className="w-full max-w-[300px] h-auto object-contain rounded-lg border p-2"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    {scannedResult?.startsWith("http") && (
                        <CardFooter className="flex justify-center">
                            <Button
                                onClick={() => window.open(scannedResult, "_blank")}
                                className="gap-2 min-w-[200px] hover:scale-105 transition-transform"
                                style={{
                                    backgroundColor: "var(--ifm-color-primary-lightest)",
                                    color: "black",
                                }}
                            >
                                Open Link
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </Layout>
    )
} 