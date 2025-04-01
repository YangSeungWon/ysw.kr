import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Layout from '@theme/Layout'

type ColorBlindnessType = 'original' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

interface ContrastScore {
    score: number;
    distinctColors: number;
    averageContrast: number;
    issues: string[];
}

export function ColorBlindnessSimulator() {
    const [imageSrc, setImageSrc] = useState<string>("")
    const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9)
    const imageRef = useRef<HTMLImageElement>(null)
    const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({})
    const [contrastScores, setContrastScores] = useState<{ [key in ColorBlindnessType]?: ContrastScore }>({})
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

    const analyzeAccessibility = (score: ContrastScore, type: ColorBlindnessType): ContrastScore => {
        const issues: string[] = []

        // 대비 분석
        if (score.averageContrast < 0.3) {
            issues.push("낮은 대비: 요소들이 구분하기 어려울 수 있습니다")
        }

        // 색상 다양성 분석
        if (score.distinctColors < 3) {
            issues.push("너무 적은 색상: 정보 전달이 제한될 수 있습니다")
        } else if (score.distinctColors > 50) {
            issues.push("너무 많은 색상: 복잡성이 높아 인지가 어려울 수 있습니다")
        }

        // 색맹 유형별 특별 분석
        if (type !== 'original') {
            const originalScore = contrastScores['original']
            if (originalScore) {
                const colorLoss = ((originalScore.distinctColors - score.distinctColors) / originalScore.distinctColors) * 100
                if (colorLoss > 30) {
                    issues.push(`원본 대비 ${Math.round(colorLoss)}%의 색상 정보 손실`)
                }

                const contrastLoss = ((originalScore.averageContrast - score.averageContrast) / originalScore.averageContrast) * 100
                if (contrastLoss > 30) {
                    issues.push(`원본 대비 ${Math.round(contrastLoss)}%의 대비 손실`)
                }
            }
        }

        return { ...score, issues }
    }

    const calculateContrastScore = (imageData: ImageData, type: ColorBlindnessType): ContrastScore => {
        const data = imageData.data
        const colors = new Set<string>()
        const pixels: number[][] = []

        // 픽셀 데이터 수집
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const colorKey = `${r},${g},${b}`
            colors.add(colorKey)
            pixels.push([r, g, b])
        }

        // 인접 픽셀 간의 대비 계산
        let totalContrast = 0
        let contrastCount = 0

        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const idx = (y * imageData.width + x)
                const current = pixels[idx]

                // 오른쪽 픽셀과의 대비
                if (x < imageData.width - 1) {
                    const right = pixels[idx + 1]
                    totalContrast += calculateRelativeLuminance(current, right)
                    contrastCount++
                }

                // 아래 픽셀과의 대비
                if (y < imageData.height - 1) {
                    const bottom = pixels[idx + imageData.width]
                    totalContrast += calculateRelativeLuminance(current, bottom)
                    contrastCount++
                }
            }
        }

        const averageContrast = contrastCount > 0 ? totalContrast / contrastCount : 0
        const distinctColors = colors.size

        // 최종 점수 계산 (0-100)
        const score = Math.min(100,
            (averageContrast * 50) + // 대비 점수 (50점 만점)
            (Math.min(distinctColors, 100) / 2) // 색상 다양성 점수 (50점 만점)
        )

        const baseScore = {
            score: Math.round(score * 100) / 100,
            distinctColors,
            averageContrast: Math.round(averageContrast * 100) / 100,
            issues: []
        }

        return analyzeAccessibility(baseScore, type)
    }

    const calculateRelativeLuminance = (color1: number[], color2: number[]): number => {
        const l1 = (0.299 * color1[0] + 0.587 * color1[1] + 0.114 * color1[2]) / 255
        const l2 = (0.299 * color2[0] + 0.587 * color2[1] + 0.114 * color2[2]) / 255
        const contrast = Math.abs(l1 - l2)
        return contrast
    }

    const simulateColorBlindness = (type: ColorBlindnessType) => {
        if (!imageRef.current || !canvasRefs.current[type]) return

        const img = imageRef.current
        const canvas = canvasRefs.current[type]
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const containerWidth = canvas.parentElement?.clientWidth || img.width
        const scale = containerWidth / img.width
        canvas.width = containerWidth
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        if (type === 'original') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const score = calculateContrastScore(imageData, type)
            setContrastScores(prev => ({ ...prev, [type]: score }))
            return
        }

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
                case 'protanopia':
                    newR = r * 0.567 + g * 0.433
                    break
                case 'deuteranopia':
                    newG = r * 0.625 + g * 0.375
                    break
                case 'tritanopia':
                    newB = r * 0.95 + g * 0.05
                    break
                case 'achromatopsia':
                    const gray = (r + g + b) / 3
                    newR = gray
                    newG = gray
                    newB = gray
                    break
            }

            data[i] = newR
            data[i + 1] = newG
            data[i + 2] = newB
        }

        ctx.putImageData(imageData, 0, 0)

        // 변환된 이미지의 대비 점수 계산
        const score = calculateContrastScore(imageData, type)
        setContrastScores(prev => ({ ...prev, [type]: score }))
    }

    const simulateAll = () => {
        const types: ColorBlindnessType[] = ['original', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']
        types.forEach(type => simulateColorBlindness(type))
    }

    useEffect(() => {
        if (imageSrc) {
            simulateAll()
        }
    }, [imageSrc])

    const getScoreComparison = (currentScore: ContrastScore, type: ColorBlindnessType) => {
        if (type === 'original') return null;
        const originalScore = contrastScores['original'];
        if (!originalScore) return null;

        const scoreDiff = ((currentScore.score - originalScore.score) / originalScore.score) * 100;
        const colorDiff = ((currentScore.distinctColors - originalScore.distinctColors) / originalScore.distinctColors) * 100;
        const contrastDiff = ((currentScore.averageContrast - originalScore.averageContrast) / originalScore.averageContrast) * 100;

        return {
            scoreDiff: Math.round(scoreDiff * 10) / 10,
            colorDiff: Math.round(colorDiff * 10) / 10,
            contrastDiff: Math.round(contrastDiff * 10) / 10
        };
    }

    const getDiffColor = (diff: number): string => {
        if (diff >= 0) return 'text-green-500';
        if (diff > -20) return 'text-yellow-500';
        return 'text-red-500';
    }

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
                    또는 이미지를 클립보드에 복사한 후 여기에 붙여넣기(Ctrl+V)하세요
                </p>
                <div
                    className="w-full max-w-md h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onPaste={handlePaste}
                >
                    <p className="text-muted-foreground">여기에 이미지를 붙여넣으세요</p>
                </div>
            </div>

            {imageSrc && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['original', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map((type) => (
                        <Card key={type} className="overflow-hidden">
                            <CardContent className="p-2 h-full">
                                <h3 className="text-center mb-2 text-base font-semibold">
                                    {type === 'original' ? 'Input' : type.charAt(0).toUpperCase() + type.slice(1)}
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
                                            />
                                        ) : (
                                            <canvas
                                                ref={el => canvasRefs.current[type as ColorBlindnessType] = el}
                                                className="max-w-full max-h-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 분석 요약 */}
            {contrastScores['original'] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">원본 대비 분석</h3>
                    <div className="space-y-2">
                        {['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map((type) => {
                            const score = contrastScores[type as ColorBlindnessType];
                            if (!score) return null;
                            const comparison = getScoreComparison(score, type as ColorBlindnessType);
                            if (!comparison) return null;

                            return (
                                <div key={type} className="flex flex-col gap-1">
                                    <h4 className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                                        <li className={getDiffColor(comparison.scoreDiff)}>
                                            전체 점수: {comparison.scoreDiff > 0 ? '+' : ''}{comparison.scoreDiff}%
                                        </li>
                                        <li className={getDiffColor(comparison.colorDiff)}>
                                            색상 구분: {comparison.colorDiff > 0 ? '+' : ''}{comparison.colorDiff}%
                                        </li>
                                        <li className={getDiffColor(comparison.contrastDiff)}>
                                            대비: {comparison.contrastDiff > 0 ? '+' : ''}{comparison.contrastDiff}%
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ColorBlindnessSimulatorPage() {
    return (
        <Layout title="Color Blindness Simulator">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-8">Color Blindness Simulator</h1>
                <p className="text-center mb-8">
                    Upload an image or paste from clipboard to see how it appears to people with different types of color blindness.
                </p>
                <ColorBlindnessSimulator />
            </div>
        </Layout>
    )
} 