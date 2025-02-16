import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';

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
                const encoded = btoa(inputText);
                setOutputText(encoded);
                setImagePreview(null);
            } else {
                try {
                    // 입력이 data URL인 경우 base64 부분만 추출
                    const base64Input = inputText.startsWith('data:')
                        ? inputText.split(',')[1]
                        : inputText;

                    const decoded = atob(base64Input);
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
            <div className="container margin-vert--lg">
                <h1>Base64 Encoder/Decoder</h1>

                <div className="margin-bottom--md">
                    <div className="button-group margin-right--sm">
                        <button
                            className={`button button--secondary ${mode === 'encode' ? 'button--active' : ''}`}
                            onClick={() => setMode('encode')}
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                borderRight: 'none'
                            }}
                        >
                            Encode
                        </button>
                        <button
                            className={`button button--secondary ${mode === 'decode' ? 'button--active' : ''}`}
                            onClick={() => setMode('decode')}
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }}
                        >
                            Decode
                        </button>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        style={{ display: mode === 'encode' ? 'inline' : 'none' }}
                        className="margin-right--sm"
                    />

                    <button
                        onClick={clearAll}
                        className="button button--secondary"
                    >
                        Clear All
                    </button>
                </div>

                <div className="row">
                    <div className="col col--6">
                        <h3>Input</h3>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={10}
                            className="margin-bottom--sm"
                            style={{ width: '100%', padding: '8px' }}
                            placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter base64 to decode'}
                        />
                    </div>

                    <div className="col col--6">
                        <h3>Output</h3>
                        <textarea
                            value={outputText}
                            readOnly
                            rows={10}
                            className="margin-bottom--sm"
                            style={{ width: '100%', padding: '8px' }}
                        />
                        <button
                            onClick={handleCopy}
                            className="button button--primary"
                            disabled={!outputText}
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                </div>

                {imagePreview && (
                    <div className="margin-top--lg">
                        <h3>Image Preview</h3>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '400px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '4px'
                            }}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
} 