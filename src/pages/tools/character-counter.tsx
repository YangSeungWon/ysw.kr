import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Copy, Clipboard, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;

    const bytes = new Blob([text]).size;
    const koreanChars = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const punctuation = (text.match(/[.,;:!?'"()\[\]{}\-_/\\@#$%^&*+=`~<>|]/g) || []).length;

    return {
      chars,
      charsNoSpaces,
      words,
      lines,
      paragraphs,
      bytes,
      koreanChars,
      englishChars,
      numbers,
      spaces,
      punctuation,
    };
  }, [text]);

  const handleClear = () => {
    setText('');
    toast.success('Text cleared');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Text copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy text');
    });
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast.success('Text pasted from clipboard');
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      toast.error('Failed to read clipboard');
    }
  };

  const StatCard = ({ title, value, primary = false }: { title: string; value: number; primary?: boolean }) => (
    <Card className={primary ? 'border-primary bg-primary/5' : ''}>
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </div>
        <div className={`text-3xl font-bold ${primary ? 'text-primary' : ''}`}>
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );

  const DetailStat = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold text-primary">{value.toLocaleString()}</div>
    </div>
  );

  return (
    <Layout title="Character Counter">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-center">Character Counter</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Count characters, words, lines, and analyze text composition
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enter Your Text</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="docusaurus"
                  size="sm"
                  onClick={handlePaste}
                  className="gap-2"
                >
                  <Clipboard className="w-4 h-4" />
                  Paste
                </Button>
                <Button
                  variant="docusaurus"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!text}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  variant="docusaurus"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[300px] font-mono text-sm resize-y"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard title="Characters" value={stats.chars} primary />
          <StatCard title="No Spaces" value={stats.charsNoSpaces} />
          <StatCard title="Words" value={stats.words} />
          <StatCard title="Lines" value={stats.lines} />
          <StatCard title="Paragraphs" value={stats.paragraphs} />
          <StatCard title="Bytes" value={stats.bytes} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <DetailStat label="Korean" value={stats.koreanChars} />
              <DetailStat label="English" value={stats.englishChars} />
              <DetailStat label="Numbers" value={stats.numbers} />
              <DetailStat label="Spaces" value={stats.spaces} />
              <DetailStat label="Punctuation" value={stats.punctuation} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CharacterCounter;
