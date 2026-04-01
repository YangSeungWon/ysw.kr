import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy, Search, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function DoiBibtexPage() {
    const [doi, setDoi] = useState('');
    const [bibtex, setBibtex] = useState('');
    const [loading, setLoading] = useState(false);

    const extractDoi = (input: string): string => {
        const trimmed = input.trim();
        // Handle full URLs like https://doi.org/10.1145/...
        const urlMatch = trimmed.match(/doi\.org\/(.+)/);
        if (urlMatch) return urlMatch[1];
        // Handle doi: prefix
        if (trimmed.toLowerCase().startsWith('doi:')) return trimmed.slice(4).trim();
        return trimmed;
    };

    const fetchBibtex = async () => {
        const resolvedDoi = extractDoi(doi);
        if (!resolvedDoi) {
            toast.error('Please enter a DOI');
            return;
        }

        setLoading(true);
        setBibtex('');

        try {
            const response = await fetch(`https://doi.org/${resolvedDoi}`, {
                headers: {
                    'Accept': 'application/x-bibtex',
                },
            });

            if (!response.ok) {
                throw new Error(`DOI not found (HTTP ${response.status})`);
            }

            const text = await response.text();
            setBibtex(text);
            toast.success('BibTeX fetched successfully');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to fetch BibTeX');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bibtex);
            toast.success('Copied to clipboard');
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            fetchBibtex();
        }
    };

    return (
        <ToolLayout
            title="DOI to BibTeX"
            description="Fetch BibTeX citation from a DOI"
            icon={<span style={{ fontSize: '1.5rem' }}>📚</span>}
        >
            <Toaster position="top-center" richColors />

            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="doi-input">DOI</Label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    id="doi-input"
                                    type="text"
                                    value={doi}
                                    onChange={(e) => setDoi(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="10.1145/3746058.3758440 or https://doi.org/..."
                                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button onClick={fetchBibtex} disabled={loading || !doi.trim()}>
                                    <Search className="w-4 h-4" />
                                    {loading ? 'Fetching...' : 'Fetch'}
                                </Button>
                            </div>
                        </div>

                        {bibtex && (
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label>BibTeX</Label>
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                            <Copy className="w-3 h-3" />
                                            Copy
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setBibtex('')}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <pre className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm overflow-x-auto whitespace-pre-wrap font-mono text-gray-900 dark:text-gray-100">
                                    {bibtex}
                                </pre>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </ToolLayout>
    );
}
