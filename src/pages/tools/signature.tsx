import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Copy, Upload } from 'lucide-react';
import { toast, Toaster } from 'sonner';

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
                toast.success('Image uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignatureData(prev => ({ ...prev, [name]: value }));
    };

    const handleDegreeChange = (value: DegreeType) => {
        setSignatureData(prev => ({ ...prev, degree: value }));
    };

    const copySignature = () => {
        if (signatureRef.current) {
            const range = document.createRange();
            range.selectNode(signatureRef.current);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
            document.execCommand('copy');
            window.getSelection()?.removeAllRanges();
            toast.success('Signature copied to clipboard!');
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
            <Toaster />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-center">Email Signature Generator</h1>
                    </div>
                    <p className="text-muted-foreground text-center">
                        Create a professional email signature
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Information</CardTitle>
                            <CardDescription>
                                Fill in your details to generate an email signature
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="highlightColor">
                                    Accent Color for M. E. H. Labels
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="color"
                                        id="highlightColor"
                                        name="highlightColor"
                                        value={signatureData.highlightColor}
                                        onChange={handleInputChange}
                                        className="w-16 h-10 p-1 cursor-pointer"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Selected: {signatureData.highlightColor}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={signatureData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Select
                                    value={signatureData.degree}
                                    onValueChange={handleDegreeChange}
                                >
                                    <SelectTrigger id="degree">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Master">Master Student</SelectItem>
                                        <SelectItem value="Integrated">Integrated Ph.D</SelectItem>
                                        <SelectItem value="Ph.D">Ph.D Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={signatureData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+82 (10) 1234 5678"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={signatureData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@postech.ac.kr"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={signatureData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photo">Photo</Label>
                                <Input
                                    type="file"
                                    id="photo"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                This is how your signature will look
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                ref={signatureRef}
                                className="bg-white p-5 rounded-lg border-2 border-border"
                            >
                                <p className="text-muted-foreground">--</p>
                                <div className="text-xl font-bold text-[#2b3137] mt-2">
                                    {signatureData.name || 'Your Name'}
                                </div>
                                <div className="text-base text-[#111] mt-2">
                                    {getDegreeTitle(signatureData.degree)}
                                </div>
                                <div className="text-base text-[#111] mt-2 space-y-1">
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
                                                className="text-primary hover:underline"
                                            >
                                                {signatureData.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Signature"
                                        className="w-[200px] object-cover mt-4 rounded"
                                    />
                                )}
                            </div>

                            <Button
                                onClick={copySignature}
                                variant="docusaurus"
                                className="w-full gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Signature
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
