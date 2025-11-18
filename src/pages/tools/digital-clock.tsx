import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Maximize, Minimize } from 'lucide-react';

interface TimeZone {
    value: string;
    label: string;
}

const timeZones: TimeZone[] = [
    { value: 'Asia/Seoul', label: 'Seoul (KST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
    { value: 'UTC', label: 'UTC' },
];

const colorThemes = {
    default: {
        background: 'hsl(var(--background))',
        text: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
    },
    neon: {
        background: '#000814',
        text: '#00f5ff',
        border: '#001d3d',
    },
    retro: {
        background: '#2d1b00',
        text: '#ff6600',
        border: '#cc5500',
    },
    matrix: {
        background: '#0d1b0d',
        text: '#00ff41',
        border: '#003d0f',
    },
    sunset: {
        background: '#1a0a1a',
        text: '#ff69b4',
        border: '#8b008b',
    },
};

export default function DigitalClockPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24');
    const [showSeconds, setShowSeconds] = useState(true);
    const [showDate, setShowDate] = useState(true);
    const [showMilliseconds, setShowMilliseconds] = useState(false);
    const [timezone, setTimezone] = useState('Asia/Seoul');
    const [fontSize, setFontSize] = useState(48);
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [showBorder, setShowBorder] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, showMilliseconds ? 10 : 1000);

        return () => clearInterval(interval);
    }, [showMilliseconds]);

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour12: timeFormat === '12',
            hour: '2-digit',
            minute: '2-digit',
        };

        if (showSeconds) {
            options.second = '2-digit';
        }

        let timeString = date.toLocaleTimeString('en-US', options);

        if (showMilliseconds) {
            const ms = date.getMilliseconds().toString().padStart(3, '0');
            timeString += `.${ms}`;
        }

        return timeString;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const theme = colorThemes[colorTheme];

    return (
        <Layout title="Digital Clock">
            {!fullScreen && (
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold text-center">Digital Clock</h1>
                        </div>
                        <p className="text-muted-foreground text-center">
                            Customizable world clock with multiple themes
                        </p>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Clock Settings</CardTitle>
                            <CardDescription>Customize your digital clock appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Time Format</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={timeFormat === '12' ? 'default' : 'outline'}
                                            onClick={() => setTimeFormat('12')}
                                            className="flex-1"
                                        >
                                            12H
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={timeFormat === '24' ? 'default' : 'outline'}
                                            onClick={() => setTimeFormat('24')}
                                            className="flex-1"
                                        >
                                            24H
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeZones.map((tz) => (
                                                <SelectItem key={tz.value} value={tz.value}>
                                                    {tz.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Font Size: {fontSize}px</Label>
                                    <input
                                        type="range"
                                        min="24"
                                        max="120"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <Select value={colorTheme} onValueChange={(v) => setColorTheme(v as keyof typeof colorThemes)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="neon">Neon</SelectItem>
                                            <SelectItem value="retro">Retro</SelectItem>
                                            <SelectItem value="matrix">Matrix</SelectItem>
                                            <SelectItem value="sunset">Sunset</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showSeconds} onCheckedChange={setShowSeconds} id="seconds" />
                                    <Label htmlFor="seconds" className="cursor-pointer">Show Seconds</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showMilliseconds} onCheckedChange={setShowMilliseconds} id="ms" />
                                    <Label htmlFor="ms" className="cursor-pointer">Show Milliseconds</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showDate} onCheckedChange={setShowDate} id="date" />
                                    <Label htmlFor="date" className="cursor-pointer">Show Date</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showBorder} onCheckedChange={setShowBorder} id="border" />
                                    <Label htmlFor="border" className="cursor-pointer">Show Border</Label>
                                </div>
                            </div>

                            <Button
                                onClick={() => setFullScreen(true)}
                                className="w-full md:w-auto gap-2"
                            >
                                <Maximize className="w-4 h-4" />
                                Enter Fullscreen
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div
                className="flex flex-col items-center justify-center p-8 rounded-xl"
                style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: theme.text,
                    backgroundColor: theme.background,
                    border: showBorder ? `2px solid ${theme.border}` : 'none',
                    minHeight: fullScreen ? '100vh' : 'auto',
                    boxShadow: colorTheme !== 'default' ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
                }}
            >
                <div>{formatTime(currentTime)}</div>
                {showDate && (
                    <div
                        style={{
                            fontSize: `${fontSize * 0.4}px`,
                            color: theme.text,
                            marginTop: '1rem',
                            fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                        }}
                    >
                        {formatDate(currentTime)}
                    </div>
                )}

                {fullScreen && (
                    <Button
                        onClick={() => setFullScreen(false)}
                        variant="secondary"
                        className="absolute top-5 right-5 gap-2"
                    >
                        <Minimize className="w-4 h-4" />
                        Exit Fullscreen
                    </Button>
                )}
            </div>
        </Layout>
    );
}
