import React, { useState, useRef } from "react"
import { QrCode, Clipboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner'
import ToolLayout from '@/components/ToolLayout';
import { Toaster } from 'sonner'
import jsQR from 'jsqr'
import { useImageInput } from '@/hooks/useImageInput'

export default function QRCodeScanner() {
    const [scannedResult, setScannedResult] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string>("")
    const handleImageFile = (file: File) => {
        if (isScanning) return;
        scanImageFile(file);
    };

    const { dropZoneProps, isDragging, fileInputRef, openFilePicker, handleFileInputChange } =
        useImageInput({ onImageLoad: handleImageFile, disabled: isScanning });

    const processImage = async (img: HTMLImageElement) => {
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

    const scanImageFile = (file: File) => {
        setIsScanning(true)
        setScannedResult("")

        const imageUrl = URL.createObjectURL(file)
        setUploadedImage(imageUrl)
        const img = document.createElement('img')
        img.crossOrigin = "anonymous"
        img.onload = () => processImage(img)
        img.onerror = () => {
            URL.revokeObjectURL(imageUrl)
            setIsScanning(false)
            toast.error("Image Error", {
                description: "Failed to load the image"
            })
        }
        img.src = imageUrl
    }

    return (
        <ToolLayout
            title="QR Code Scanner"
            description="Scan QR codes from images or clipboard"
            icon={<QrCode className="h-8 w-8 text-primary" />}
            maxWidth="max-w-5xl"
        >
            <Toaster />
            <Card className="w-full max-w-[600px] mx-auto">
                    <CardHeader>
                        <CardTitle>Scan QR Code</CardTitle>
                        <CardDescription>
                            Upload an image containing a QR code to scan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-6" {...dropZoneProps}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <div
                                onClick={openFilePicker}
                                style={{
                                    width: '100%',
                                    border: `2px dashed ${isDragging ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}`,
                                    borderRadius: '0.5rem',
                                    padding: '2rem 1rem',
                                    textAlign: 'center',
                                    cursor: isScanning ? 'default' : 'pointer',
                                    background: isDragging ? 'var(--ifm-color-primary-lightest)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    opacity: isScanning ? 0.5 : 1,
                                }}
                            >
                                <QrCode style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem', color: 'var(--ifm-color-emphasis-500)' }} />
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)' }}>
                                    {isScanning ? 'Scanning...' : isDragging ? 'Drop image here' : 'Drag & drop, click to upload, or paste (Ctrl+V)'}
                                </p>
                            </div>

                            {scannedResult && (
                                <div className="w-full space-y-3">
                                    <div className="mb-2 font-medium">Scanned Result:</div>
                                    <AlertDescription className="bg-primary/5 border-primary/20 break-all bg-background p-3 rounded border font-mono text-lg">
                                        {scannedResult}
                                    </AlertDescription>
                                    {scannedResult.startsWith("http") && (
                                        <Button
                                            variant="docusaurus"
                                            onClick={() => window.open(scannedResult, "_blank")}
                                            className="gap-2 w-full hover:scale-105 transition-transform"
                                        >
                                            Open Link
                                        </Button>
                                    )}
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
                </Card>
        </ToolLayout>
    )
} 