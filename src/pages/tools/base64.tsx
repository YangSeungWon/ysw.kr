import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileCode, Upload, Copy, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Base64Page() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextConversion = () => {
        try {
            if (!inputText) {
                setOutputText('');
                setImagePreview(null);
                return;
            }

            if (mode === 'encode') {
                // 유니코드 문자열을 UTF-8 바이트 배열로 변환
                const encoder = new TextEncoder();
                const data = encoder.encode(inputText);
                // 바이트 배열을 base64로 변환
                const encoded = btoa(String.fromCharCode(...Array.from(data)));
                setOutputText(encoded);
                setImagePreview(null);
            } else {
                try {
                    // 입력이 data URL인 경우 base64 부분만 추출
                    const base64Input = inputText.startsWith('data:')
                        ? inputText.split(',')[1]
                        : inputText;

                    // base64를 바이트 배열로 디코딩
                    const binaryString = atob(base64Input);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    // 바이트 배열을 UTF-8 문자열로 변환
                    const decoder = new TextDecoder();
                    const decoded = decoder.decode(bytes);
                    setOutputText(decoded);

                    // 디코드한 결과가 이미지인지 확인
                    if (inputText.startsWith('data:image')) {
                        setImagePreview(inputText);
                    } else if (base64Input === inputText) {
                        // 순수 base64 문자열이 이미지인 경우를 처리
                        try {
                            const testDecode = atob(base64Input);
                            // 이미지 파일의 시그니처 확인 (PNG, JPEG 등)
                            const isImage = testDecode.startsWith('\x89PNG') ||
                                testDecode.startsWith('\xFF\xD8\xFF') ||
                                testDecode.startsWith('GIF');
                            if (isImage) {
                                setImagePreview(`data:image/png;base64,${base64Input}`);
                            } else {
                                setImagePreview(null);
                            }
                        } catch {
                            setImagePreview(null);
                        }
                    } else {
                        setImagePreview(null);
                    }
                } catch (e) {
                    throw e;
                }
            }
        } catch (error) {
            setOutputText('Error: Invalid input for conversion');
            setImagePreview(null);
            toast.error('Invalid input for conversion');
        }
    };

    // Add useEffect to auto-convert when input changes
    useEffect(() => {
        handleTextConversion();
    }, [inputText, mode]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            // data:image/xxx;base64, 부분을 제거하고 순수 base64만 추출
            const pureBase64 = base64String.split('base64,')[1];
            setInputText('');
            setOutputText(pureBase64);
            setImagePreview(base64String); // 미리보기용으로는 전체 data URL 사용
            toast.success('Image uploaded successfully');
        };
        reader.readAsDataURL(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText)
            .then(() => {
                toast.success('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error('Failed to copy to clipboard');
            });
    };

    const clearAll = () => {
        setInputText('');
        setOutputText('');
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Cleared all fields');
    };

    return (
        <Layout title="Base64 Encoder/Decoder">
            <Toaster />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <FileCode className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">Base64 Encoder/Decoder</h1>
                    </div>
                    <p className="text-muted-foreground text-center">Encode and decode Base64 text and images</p>
                </div>

                <Card className="w-full max-w-[900px] mx-auto">
                    <CardHeader>
                        <CardTitle>Base64 Conversion</CardTitle>
                        <CardDescription>
                            Convert text and images to/from Base64 encoding
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="inline-flex rounded-md shadow-sm">
                                <Button
                                    variant={mode === 'encode' ? 'default' : 'outline'}
                                    onClick={() => setMode('encode')}
                                    className="rounded-r-none"
                                >
                                    Encode
                                </Button>
                                <Button
                                    variant={mode === 'decode' ? 'default' : 'outline'}
                                    onClick={() => setMode('decode')}
                                    className="rounded-l-none"
                                >
                                    Decode
                                </Button>
                            </div>

                            {mode === 'encode' && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        ref={fileInputRef}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Image
                                    </Button>
                                </>
                            )}

                            <Button
                                onClick={clearAll}
                                variant="outline"
                                className="gap-2 ml-auto"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Input</Label>
                                <Textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    rows={10}
                                    className="font-mono text-sm"
                                    placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter base64 to decode'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Output</Label>
                                <Textarea
                                    value={outputText}
                                    readOnly
                                    rows={10}
                                    className="font-mono text-sm bg-muted"
                                />
                                <Button
                                    onClick={handleCopy}
                                    disabled={!outputText}
                                    className="w-full gap-2"
                                    variant="outline"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy to Clipboard
                                </Button>
                            </div>
                        </div>

                        {imagePreview && (
                            <div className="space-y-2 pt-4 border-t">
                                <Label>Image Preview</Label>
                                <div className="border rounded-lg p-4 bg-white flex justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full max-h-96 rounded"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
