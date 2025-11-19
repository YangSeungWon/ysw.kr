import React, { useState, useRef, type ChangeEvent, useEffect } from "react"
import { Image, QrCode, Clipboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner'
import ToolLayout from '@/components/ToolLayout';
import { Toaster } from 'sonner'
import jsQR from 'jsqr'

export default function QRCodeScanner() {
    const [scannedResult, setScannedResult] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            if (isScanning) return;

            try {
                // Try to get image from clipboard items API first
                if (e.clipboardData?.items) {
                    const items = Array.from(e.clipboardData.items);
                    const imageItem = items.find(item => item.type.startsWith('image/'));

                    if (imageItem) {
                        e.preventDefault();
                        const blob = await imageItem.getAsFile()?.slice();
                        if (!blob) return;

                        setIsScanning(true);
                        setScannedResult("");

                        const imageUrl = URL.createObjectURL(blob);
                        setUploadedImage(imageUrl);

                        const img = document.createElement('img');
                        img.crossOrigin = "anonymous";
                        img.onload = () => processImage(img);
                        img.onerror = () => {
                            URL.revokeObjectURL(imageUrl);
                            setIsScanning(false);
                            toast.error("Image Error", {
                                description: "Failed to load the image from clipboard"
                            });
                        };
                        img.src = imageUrl;
                        return;
                    }
                }

                // Fallback to clipboard read API
                const clipboardItems = await navigator.clipboard.read();
                const imageType = clipboardItems.find(item =>
                    item.types.some(type => type.startsWith('image/'))
                );

                if (!imageType) {
                    return;
                }

                e.preventDefault();
                setIsScanning(true);
                setScannedResult("");

                const blob = await imageType.getType('image/png');
                const imageUrl = URL.createObjectURL(blob);
                setUploadedImage(imageUrl);

                const img = document.createElement('img');
                img.crossOrigin = "anonymous";
                img.onload = () => processImage(img);
                img.onerror = () => {
                    URL.revokeObjectURL(imageUrl);
                    setIsScanning(false);
                    toast.error("Image Error", {
                        description: "Failed to load the image from clipboard"
                    });
                };
                img.src = imageUrl;
            } catch (error) {
                console.error("Clipboard error:", error);
                toast.error("Clipboard Error", {
                    description: "Failed to read image from clipboard. Make sure you have an image copied."
                });
                setIsScanning(false);
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [isScanning]);

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
            img.onload = () => processImage(img)
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
                        <div className="flex flex-col items-center gap-6">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <div className="flex gap-4 w-full justify-center">
                                <Button
                                    variant="docusaurus"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="max-w-[256px] h-12 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                                    disabled={isScanning}
                                    size="lg"
                                >
                                    <Image className="w-5 h-5 mr-2" />
                                    {isScanning ? "Scanning..." : "Upload QR Code"}
                                </Button>
                            </div>

                            <div className="text-sm text-muted-foreground text-center">
                                You can also paste an image (Ctrl+V) directly to scan
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