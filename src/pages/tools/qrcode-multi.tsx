import React, { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
    Copy, Download, QrCode, Plus, Trash2, Globe, Mail,
    Linkedin, Twitter, Facebook, Instagram, Youtube, Github,
    Phone, MapPin, Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import ToolLayout from '@/components/ToolLayout'
import { Toaster } from 'sonner'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import JSZip from 'jszip'
import ReactDOMServer from 'react-dom/server'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

type QRField = {
    id: string
    label: string
    value: string
    type: 'preset' | 'custom'
}

type PresetOption = {
    label: string
    placeholder: string
    icon?: React.ReactNode
}

const PRESET_OPTIONS: { [key: string]: PresetOption } = {
    'Website': {
        label: 'Website',
        placeholder: 'https://example.com',
        icon: <Globe className="h-5 w-5 text-[#2563EB]" />
    },
    'LinkedIn': {
        label: 'LinkedIn',
        placeholder: 'https://linkedin.com/in/...',
        icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />
    },
    'Twitter': {
        label: 'Twitter',
        placeholder: 'https://twitter.com/...',
        icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />
    },
    'Facebook': {
        label: 'Facebook',
        placeholder: 'https://facebook.com/...',
        icon: <Facebook className="h-5 w-5 text-[#1877F2]" />
    },
    'Instagram': {
        label: 'Instagram',
        placeholder: 'https://instagram.com/...',
        icon: <Instagram className="h-5 w-5 text-[#E4405F]" />
    },
    'YouTube': {
        label: 'YouTube',
        placeholder: 'https://youtube.com/...',
        icon: <Youtube className="h-5 w-5 text-[#FF0000]" />
    },
    'Email': {
        label: 'Email',
        placeholder: 'example@email.com',
        icon: <Mail className="h-5 w-5 text-[#EA4335]" />
    },
    'Phone': {
        label: 'Phone',
        placeholder: '+1234567890',
        icon: <Phone className="h-5 w-5 text-[#10B981]" />
    },
    'Custom': {
        label: 'Custom',
        placeholder: 'Enter custom text or URL',
        icon: <Globe className="h-5 w-5 text-[#6B7280]" />
    }
}

const getIconForLabel = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('linkedin')) return <Linkedin className="h-6 w-6 text-[#0A66C2]" />
    if (lowerLabel.includes('email')) return <Mail className="h-6 w-6 text-[#EA4335]" />
    if (lowerLabel.includes('website')) return <Globe className="h-6 w-6 text-[#2563EB]" />
    if (lowerLabel.includes('twitter')) return <Twitter className="h-6 w-6 text-[#1DA1F2]" />
    if (lowerLabel.includes('facebook')) return <Facebook className="h-6 w-6 text-[#1877F2]" />
    if (lowerLabel.includes('instagram')) return <Instagram className="h-6 w-6 text-[#E4405F]" />
    if (lowerLabel.includes('youtube')) return <Youtube className="h-6 w-6 text-[#FF0000]" />
    if (lowerLabel.includes('github')) return <Github className="h-6 w-6 text-[#181717]" />
    if (lowerLabel.includes('phone')) return <Phone className="h-6 w-6 text-[#10B981]" />
    if (lowerLabel.includes('location')) return <MapPin className="h-6 w-6 text-[#EF4444]" />
    if (lowerLabel.includes('calendar')) return <Calendar className="h-6 w-6 text-[#6366F1]" />
    return <Globe className="h-6 w-6 text-[#6B7280]" />  // Default icon
}

const PRESET_LABELS = [
    'LinkedIn',
    'Website',
    'Email',
    'Twitter',
    'Facebook',
    'Instagram',
    'YouTube',
    'GitHub',
    'Phone',
    'Location',
    'Calendar'
]

export default function QRCodeMulti() {
    const [fields, setFields] = useState<QRField[]>([
        { id: '1', label: 'LinkedIn', value: '', type: 'preset' }
    ])
    const [activeField, setActiveField] = useState<string>('1')
    const qrRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const addField = () => {
        const newId = Date.now().toString()
        setFields([...fields, { id: newId, label: 'Custom', value: '', type: 'custom' }])
        setActiveField(newId)
    }

    const removeField = (id: string) => {
        if (fields.length <= 1) {
            toast.error("At least one field is required")
            return
        }
        setFields(fields.filter(field => field.id !== id))
        if (activeField === id) {
            setActiveField(fields[0].id)
        }
    }

    const updateField = (id: string, updates: Partial<QRField>) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, ...updates } : field
        ))
    }

    const handleLabelChange = (id: string, newLabel: string) => {
        const field = fields.find(f => f.id === id)
        if (!field) return

        updateField(id, {
            label: newLabel,
            type: newLabel === 'Custom' ? 'custom' : 'preset',
            value: ''  // Reset value when changing type
        })
    }

    const handleValueChange = (id: string, newValue: string) => {
        updateField(id, { value: newValue })
    }

    const createQRContainer = (field: QRField, qrRef: HTMLDivElement) => {
        const container = document.createElement('div')
        container.style.display = 'flex'
        container.style.flexDirection = 'column'
        container.style.alignItems = 'center'
        container.style.backgroundColor = 'white'
        container.style.padding = '40px'
        container.style.marginBottom = '20px'
        container.style.width = '600px'
        container.style.boxSizing = 'border-box'

        // Add header
        const header = document.createElement('div')
        header.style.display = 'flex'
        header.style.alignItems = 'center'
        header.style.justifyContent = 'center'
        header.style.gap = '12px'
        header.style.marginBottom = '4px'

        // Add icon
        const iconSvg = PRESET_OPTIONS[field.label]?.icon
        if (iconSvg) {
            const iconContainer = document.createElement('div')
            iconContainer.style.transform = 'scale(1.5)'
            iconContainer.innerHTML = ReactDOMServer.renderToString(iconSvg)
            header.appendChild(iconContainer)
        }

        // Add label
        const labelSpan = document.createElement('span')
        labelSpan.textContent = field.label
        labelSpan.style.fontSize = '24px'
        labelSpan.style.fontWeight = '600'
        header.appendChild(labelSpan)

        container.appendChild(header)

        // Add QR code
        container.appendChild(qrRef.cloneNode(true))

        // Add URL/text below QR code
        const urlText = document.createElement('div')
        urlText.textContent = field.value
        urlText.style.marginTop = '12px'
        urlText.style.textAlign = 'center'
        urlText.style.fontSize = '18px'
        urlText.style.color = '#666'
        urlText.style.wordBreak = 'break-all'
        container.appendChild(urlText)

        return container
    }

    const downloadQRCode = async (id: string) => {
        const qrRef = qrRefs.current[id]
        if (!qrRef) return

        const field = fields.find(f => f.id === id)
        if (!field || !field.value) {
            toast.error("No content to generate QR code")
            return
        }

        const container = createQRContainer(field, qrRef)
        document.body.appendChild(container)

        try {
            const dataUrl = await domtoimage.toPng(container, {
                quality: 1.0,
                height: container.offsetHeight * 2,
                width: container.offsetWidth * 2,
                style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left'
                }
            })
            const link = document.createElement('a')
            link.download = `qrcode-${field.label.toLowerCase()}.png`
            link.href = dataUrl
            link.click()
            toast.success("QR Code downloaded")
        } catch (error) {
            console.error('Error downloading QR code:', error)
            toast.error("Failed to download QR code")
        } finally {
            document.body.removeChild(container)
        }
    }

    const downloadAllAsZip = async () => {
        const mainContainer = document.createElement('div')
        mainContainer.style.display = 'flex'
        mainContainer.style.flexDirection = 'column'
        mainContainer.style.backgroundColor = 'white'
        mainContainer.style.padding = '40px'
        mainContainer.style.width = '600px'
        mainContainer.style.boxSizing = 'border-box'
        document.body.appendChild(mainContainer)

        try {
            const validFields = fields.filter(field => field.value && qrRefs.current[field.id])
            for (const field of validFields) {
                const qrContainer = createQRContainer(field, qrRefs.current[field.id]!)
                mainContainer.appendChild(qrContainer)
            }

            const dataUrl = await domtoimage.toPng(mainContainer, {
                quality: 1.0,
                height: mainContainer.offsetHeight * 2,
                width: mainContainer.offsetWidth * 2,
                style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left'
                }
            })
            const link = document.createElement('a')
            link.download = 'all-qrcodes.png'
            link.href = dataUrl
            link.click()
            toast.success("All QR codes downloaded")
        } catch (error) {
            console.error('Error downloading QR codes:', error)
            toast.error("Failed to download QR codes")
        } finally {
            document.body.removeChild(mainContainer)
        }
    }

    const copyToClipboard = async (id: string) => {
        const qrRef = qrRefs.current[id]
        if (!qrRef) return

        const field = fields.find(f => f.id === id)
        if (!field || !field.value) {
            toast.error("No content to generate QR code")
            return
        }

        const container = createQRContainer(field, qrRef)
        document.body.appendChild(container)

        try {
            const dataUrl = await domtoimage.toPng(container)
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ])
            toast.success("Copied to clipboard")
        } catch (error) {
            console.error('Error copying to clipboard:', error)
            toast.error("Failed to copy to clipboard")
        } finally {
            document.body.removeChild(container)
        }
    }

    return (
        <ToolLayout
            title="Multi QR Code Generator"
            description="Generate multiple QR codes for different fields"
            icon={<QrCode className="h-8 w-8 text-primary" />}
            maxWidth="max-w-5xl"
        >
            <Toaster />
            <Card className="w-full max-w-[600px] mx-auto mb-8">
                    <CardHeader>
                        <CardTitle>Generate QR Codes</CardTitle>
                        <CardDescription>
                            Add fields and enter content to generate QR codes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={field.label}
                                            onValueChange={(value) => handleLabelChange(field.id, value)}
                                        >
                                            <SelectTrigger className="flex-1 bg-white">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {Object.entries(PRESET_OPTIONS).map(([key, option]) => (
                                                    <SelectItem key={key} value={key}>
                                                        <div className="flex items-center gap-2">
                                                            {option.icon}
                                                            <span>{option.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeField(field.id)}
                                            className="shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => handleValueChange(field.id, e.target.value)}
                                            placeholder={PRESET_OPTIONS[field.label]?.placeholder || "Enter URL or text..."}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={addField}
                                className="flex-1 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Field
                            </Button>
                            {fields.some(field => field.value) && (
                                <Button
                                    variant="default"
                                    onClick={downloadAllAsZip}
                                    className="flex-1 gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download All as ZIP
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {fields.some(field => field.value) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-w-7xl mx-auto">
                        {fields.map((field) => field.value && (
                            <Card key={field.id} className="w-full" style={{ border: '0px solid #e0e0e0' }}>
                                <CardHeader className="text-center py-1 px-2">
                                    <CardTitle className="flex items-center justify-center gap-1 text-base">
                                        {PRESET_OPTIONS[field.label]?.icon}
                                        {field.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center p-0">
                                    <div ref={(el) => (qrRefs.current[field.id] = el)} className="bg-white rounded-lg">
                                        <QRCodeSVG
                                            value={field.value}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                            style={{ width: '200px', height: '200px' }}
                                        />
                                    </div>
                                    <div className="w-full text-center mt-1 mb-2">
                                        <div className="text-sm text-muted-foreground break-all line-clamp-2 hover:line-clamp-none transition-all px-2">
                                            {field.value}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full px-2 pb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(field.id)}
                                            className="flex-1 gap-1 h-8"
                                        >
                                            <Copy className="h-3 w-3" />
                                            Copy
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => downloadQRCode(field.id)}
                                            className="flex-1 gap-1 h-8"
                                        >
                                            <Download className="h-3 w-3" />
                                            Download
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
        </ToolLayout>
    )
} 