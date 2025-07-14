import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';

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
        };
        reader.readAsDataURL(file);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    const clearAll = () => {
        setInputText('');
        setOutputText('');
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Layout title="Base64 Encoder/Decoder">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <h1>Base64 Encoder/Decoder</h1>

                <div className="card p-6 mb-6">
                    <div className="mb-4">
                        <div className="inline-flex mr-2">
                            <Button
                                variant={mode === 'encode' ? 'default' : 'secondary'}
                                onClick={() => setMode('encode')}
                                className="rounded-r-none"
                            >
                                Encode
                            </Button>
                            <Button
                                variant={mode === 'decode' ? 'default' : 'secondary'}
                                onClick={() => setMode('decode')}
                                className="rounded-l-none"
                            >
                                Decode
                            </Button>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            style={{
                                display: mode === 'encode' ? 'inline' : 'none',
                                marginRight: 'var(--ifm-spacing-horizontal)',
                            }}
                            className="hidden"
                        />

                        <Button
                            onClick={clearAll}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                            Clear All
                        </Button>
                    </div>

                    <div className="row">
                        <div className="col col--6">
                            <h3>Input</h3>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={10}
                                className="mb-2"
                                style={{
                                    width: '100%',
                                    padding: 'var(--ifm-spacing-vertical) var(--ifm-spacing-horizontal)',
                                    backgroundColor: 'var(--ifm-background-color)',
                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                    borderRadius: 'var(--ifm-card-border-radius)',
                                    color: 'var(--ifm-font-color-base)',
                                }}
                                placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter base64 to decode'}
                            />
                        </div>

                        <div className="col col--6">
                            <h3>Output</h3>
                            <textarea
                                value={outputText}
                                readOnly
                                rows={10}
                                className="mb-2"
                                style={{
                                    width: '100%',
                                    padding: 'var(--ifm-spacing-vertical) var(--ifm-spacing-horizontal)',
                                    backgroundColor: 'var(--ifm-background-surface-color)',
                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                    borderRadius: 'var(--ifm-card-border-radius)',
                                    color: 'var(--ifm-font-color-base)',
                                }}
                            />
                            <Button
                                onClick={handleCopy}
                                disabled={!outputText}
                            >
                                Copy to Clipboard
                            </Button>
                        </div>
                    </div>

                    {imagePreview && (
                        <div className="mt-6">
                            <h3>Image Preview</h3>
                            <div className="card p-2" style={{
                                backgroundColor: 'var(--ifm-background-surface-color)',
                            }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        borderRadius: 'var(--ifm-card-border-radius)',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
} 