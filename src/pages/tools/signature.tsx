import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';

type DegreeType = 'Master' | 'Integrated' | 'Ph.D';

interface SignatureData {
    name: string;
    degree: DegreeType;
    phone: string;
    email: string;
    website: string;
    imageUrl: string;
    highlightColor: string;
}

export default function SignaturePage() {
    const defaultColor = '#C80150';

    const [signatureData, setSignatureData] = useState<SignatureData>({
        name: '',
        degree: 'Master',
        phone: '',
        email: '',
        website: '',
        imageUrl: '',
        highlightColor: defaultColor,
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const signatureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSignatureData(prev => ({
            ...prev,
            highlightColor: defaultColor
        }));
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                setSignatureData(prev => ({ ...prev, imageUrl: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSignatureData(prev => ({ ...prev, [name]: value }));
    };

    const copySignature = () => {
        if (signatureRef.current) {
            const range = document.createRange();
            range.selectNode(signatureRef.current);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
            document.execCommand('copy');
            window.getSelection()?.removeAllRanges();
            alert('Signature copied to clipboard!');
        }
    };

    const getDegreeTitle = (degree: DegreeType) => {
        switch (degree) {
            case 'Master': return 'M.S. Student';
            case 'Integrated': return 'Integrated Ph.D. Student';
            case 'Ph.D': return 'Ph.D. Student';
        }
    };

    return (
        <Layout title="Email Signature Generator">
            <div className="container">
                <h1>Email Signature Generator</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h3>Input Information</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Accent Color for M. E. H. Labels:
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    name="highlightColor"
                                    value={signatureData.highlightColor}
                                    onChange={handleInputChange}
                                    style={{ width: '50px', height: '40px', padding: '0' }}
                                />
                                <span style={{ color: '#666' }}>
                                    Selected color: {signatureData.highlightColor}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={signatureData.name}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="John Doe"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Degree:</label>
                            <select
                                name="degree"
                                value={signatureData.degree}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="Master">Master Student</option>
                                <option value="Integrated">Integrated Ph.D</option>
                                <option value="Ph.D">Ph.D Student</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Phone:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={signatureData.phone}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="+82 (10) 1234 5678"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={signatureData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="example@postech.ac.kr"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Website:</label>
                            <input
                                type="url"
                                name="website"
                                value={signatureData.website}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '-2px' }}>Photo:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div>
                        <h3>Preview</h3>
                        <div ref={signatureRef} style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <p>--</p>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2b3137' }}>
                                {signatureData.name}
                            </div>
                            <div style={{ fontSize: '16px', color: '#111', marginTop: '10px' }}>
                                {getDegreeTitle(signatureData.degree)}
                            </div>
                            <div style={{ fontSize: '16px', color: '#111', marginTop: '3px' }}>
                                {signatureData.phone && (
                                    <div>
                                        <b style={{ color: signatureData.highlightColor }}>M.</b> {signatureData.phone}
                                    </div>
                                )}
                                {signatureData.email && (
                                    <div>
                                        <b style={{ color: signatureData.highlightColor }}>E.</b> {signatureData.email}
                                    </div>
                                )}
                                {signatureData.website && (
                                    <div>
                                        <b style={{ color: signatureData.highlightColor }}>H.</b>{' '}
                                        <a
                                            href={signatureData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {signatureData.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    style={{
                                        width: '200px',
                                        objectFit: 'cover',
                                        marginTop: '15px',
                                    }}
                                />
                            )}
                        </div>
                        <button
                            onClick={copySignature}
                            className="button button--primary"
                            style={{ marginTop: '15px' }}
                        >
                            Copy Signature
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 