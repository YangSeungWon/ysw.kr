import React, { useState, useRef } from 'react';
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
    const inputRef = useRef<HTMLInputElement>(null);

    const extractDoi = (input: string): string => {
        const trimmed = input.trim();
        const urlMatch = trimmed.match(/doi\.org\/(.+)/);
        if (urlMatch) return urlMatch[1];
        if (trimmed.toLowerCase().startsWith('doi:')) return trimmed.slice(4).trim();
        return trimmed;
    };

    const SKIP_WORDS = new Set([
        'a', 'an', 'the', 'of', 'for', 'to', 'in', 'on', 'with', 'from',
        'by', 'at', 'as', 'and', 'or', 'is', 'are', 'was', 'were', 'how',
        'what', 'when', 'where', 'why', 'who', 'which', 'can', 'do', 'does',
        'toward', 'towards', 'into', 'through', 'during', 'between', 'using',
    ]);

    const removeDiacritics = (s: string) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const generateCitationKey = (raw: string): string => {
        // Extract author and title from raw bibtex
        const authorMatch = raw.match(/author\s*=\s*\{([^}]+)\}/i);
        const yearMatch = raw.match(/year\s*=\s*\{?(\d{4})\}?/i);
        const titleMatch = raw.match(/title\s*=\s*\{([^}]+)\}/i);

        if (!authorMatch || !yearMatch || !titleMatch) return '';

        const firstAuthor = removeDiacritics(
            authorMatch[1].split(/\s+and\s+/i)[0].split(',')[0].trim().toLowerCase()
        ).replace(/[^a-z]/g, '');

        const year = yearMatch[1];

        const words = removeDiacritics(titleMatch[1].toLowerCase()).match(/[a-z]+/g) || [];
        const meaningful = words.filter(w => !SKIP_WORDS.has(w)).slice(0, 3);

        return `${firstAuthor}${year}_${meaningful.join('_')}`;
    };

    const formatBibtex = (raw: string): string => {
        // Fix HTML entities
        let text = raw.replace(/&amp;/g, '\\&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

        // Generate better citation key
        const newKey = generateCitationKey(text);
        if (newKey) {
            text = text.replace(/@(\w+)\{[^,]+,/, `@$1{${newKey},`);
        }

        // Format with proper indentation
        const match = text.match(/^(@\w+\{[^,]+,)\s*(.*)\s*\}$/s);
        if (!match) return text;

        const header = match[1];
        const body = match[2];

        const fields = body.split(/,\s*(?=\w+\s*=)/).map(f => f.trim()).filter(Boolean);
        const formatted = fields.map(f => `  ${f}`).join(',\n');

        return `${header}\n${formatted}\n}`;
    };

    const fetchBibtex = async () => {
        const currentDoi = doi || inputRef.current?.value || '';
        if (currentDoi && !doi) setDoi(currentDoi);
        const resolvedDoi = extractDoi(currentDoi);
        if (!resolvedDoi) {
            toast.error('Please enter a DOI');
            return;
        }

        setLoading(true);
        setBibtex('');

        try {
            const response = await fetch(`https://doi.org/${resolvedDoi}`, {
                headers: { 'Accept': 'application/x-bibtex' },
            });

            if (!response.ok) {
                throw new Error(`DOI not found (HTTP ${response.status})`);
            }

            const text = await response.text();
            setBibtex(formatBibtex(text));
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
                                    ref={inputRef}
                                    id="doi-input"
                                    type="text"
                                    value={doi}
                                    onChange={(e) => setDoi(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="10.1145/3746058.3758440 or https://doi.org/..."
                                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button variant="docusaurus" onClick={fetchBibtex} disabled={loading}>
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
                                        <button
                                            className="button button--sm button--outline"
                                            onClick={copyToClipboard}
                                        >
                                            <Copy className="w-3 h-3" />
                                            Copy
                                        </button>
                                        <button
                                            className="button button--sm button--outline"
                                            onClick={() => setBibtex('')}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <pre
                                    onClick={copyToClipboard}
                                    className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm overflow-x-auto whitespace-pre-wrap font-mono text-gray-900 dark:text-gray-100"
                                    style={{ cursor: 'pointer' }}
                                    title="Click to copy"
                                >
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
