import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Timer, Clock, Play, Pause, RotateCcw, Plus, Maximize, Minimize } from 'lucide-react';

const colorThemes = {
    default: {
        background: 'hsl(var(--background))',
        text: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        accent: 'hsl(var(--primary))',
    },
    neon: {
        background: '#000814',
        text: '#00f5ff',
        border: '#001d3d',
        accent: '#0077b6',
    },
    retro: {
        background: '#2d1b00',
        text: '#ff6600',
        border: '#cc5500',
        accent: '#ff8500',
    },
    matrix: {
        background: '#0d1b0d',
        text: '#00ff41',
        border: '#003d0f',
        accent: '#00cc33',
    },
    sunset: {
        background: '#1a0a1a',
        text: '#ff69b4',
        border: '#8b008b',
        accent: '#ff1493',
    },
};

interface LapTime {
    id: number;
    time: number;
    lapTime: number;
}

export default function TimerStopwatchPage() {
    const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [fontSize, setFontSize] = useState(48);
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [showMilliseconds, setShowMilliseconds] = useState(true);
    const [showBorder, setShowBorder] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
    const [lapCounter, setLapCounter] = useState(0);

    const [timerMinutes, setTimerMinutes] = useState(5);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerTime, setTimerTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBDWR2e/IeSEFKXrI7+GOTA0PVqHj8bllHgg2jdXzzn0vBSF+zPLaizsIGGS57+OZSA0PUqPl9LdnHghAjdv5xoYrBSuG0+6fXBoSQA==');
        audioRef.current.volume = 0.3;
    }, []);

    useEffect(() => {
        if (stopwatchRunning) {
            intervalRef.current = setInterval(() => {
                setStopwatchTime(prev => prev + (showMilliseconds ? 10 : 1000));
            }, showMilliseconds ? 10 : 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [stopwatchRunning, showMilliseconds]);

    useEffect(() => {
        if (timerRunning && timerTime > 0) {
            intervalRef.current = setInterval(() => {
                setTimerTime(prev => {
                    if (prev <= (showMilliseconds ? 10 : 1000)) {
                        setTimerRunning(false);
                        setTimerFinished(true);
                        if (soundEnabled && audioRef.current) audioRef.current.play().catch(console.error);
                        return 0;
                    }
                    return prev - (showMilliseconds ? 10 : 1000);
                });
            }, showMilliseconds ? 10 : 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [timerRunning, timerTime, showMilliseconds, soundEnabled]);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        if (showMilliseconds) {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startStopwatch = () => setStopwatchRunning(true);
    const stopStopwatch = () => setStopwatchRunning(false);
    const resetStopwatch = () => {
        setStopwatchRunning(false);
        setStopwatchTime(0);
        setLapTimes([]);
        setLapCounter(0);
    };

    const addLap = () => {
        if (stopwatchRunning) {
            const newLapCounter = lapCounter + 1;
            const lapTime = lapTimes.length > 0 ? stopwatchTime - lapTimes[lapTimes.length - 1].time : stopwatchTime;
            setLapTimes(prev => [...prev, { id: newLapCounter, time: stopwatchTime, lapTime }]);
            setLapCounter(newLapCounter);
        }
    };

    const startTimer = () => {
        if (timerTime === 0) setTimerTime((timerMinutes * 60 + timerSeconds) * 1000);
        setTimerRunning(true);
        setTimerFinished(false);
    };

    const stopTimer = () => setTimerRunning(false);
    const resetTimer = () => {
        setTimerRunning(false);
        setTimerTime(0);
        setTimerFinished(false);
    };

    const theme = colorThemes[colorTheme];

    return (
        <Layout title="Timer & Stopwatch">
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

            {!fullScreen && (
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold text-center">Timer & Stopwatch</h1>
                        </div>
                        <p className="text-muted-foreground text-center">Precision timing tool with customizable themes</p>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>Customize your timer or stopwatch</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Mode</Label>
                                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stopwatch' | 'timer')}>
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                                            <TabsTrigger value="timer">Timer</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
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

                                <div className="flex items-end">
                                    <Button onClick={() => setFullScreen(true)} className="w-full gap-2">
                                        <Maximize className="w-4 h-4" />
                                        Fullscreen
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showMilliseconds} onCheckedChange={setShowMilliseconds} id="ms" />
                                    <Label htmlFor="ms" className="cursor-pointer">Show Milliseconds</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={showBorder} onCheckedChange={setShowBorder} id="border" />
                                    <Label htmlFor="border" className="cursor-pointer">Show Border</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} id="sound" />
                                    <Label htmlFor="sound" className="cursor-pointer">Sound Alerts</Label>
                                </div>
                            </div>

                            {activeTab === 'timer' && (
                                <div className="space-y-2">
                                    <Label>Timer Duration</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerMinutes}
                                            onChange={(e) => setTimerMinutes(Number(e.target.value))}
                                            disabled={timerRunning}
                                            className="w-20"
                                        />
                                        <span className="text-sm">minutes</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerSeconds}
                                            onChange={(e) => setTimerSeconds(Number(e.target.value))}
                                            disabled={timerRunning}
                                            className="w-20"
                                        />
                                        <span className="text-sm">seconds</span>
                                    </div>
                                </div>
                            )}
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
                    color: timerFinished ? '#ff4444' : theme.text,
                    backgroundColor: theme.background,
                    border: showBorder ? `2px solid ${theme.border}` : 'none',
                    minHeight: fullScreen ? '100vh' : 'auto',
                    boxShadow: colorTheme !== 'default' ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
                    animation: timerFinished ? 'pulse 1s infinite' : 'none',
                }}
            >
                <div>{activeTab === 'stopwatch' ? formatTime(stopwatchTime) : formatTime(timerTime)}</div>

                <div className="flex gap-3 mt-8">
                    {activeTab === 'stopwatch' ? (
                        <>
                            <Button
                                onClick={stopwatchRunning ? stopStopwatch : startStopwatch}
                                size="lg"
                                className="gap-2"
                                style={{ backgroundColor: stopwatchRunning ? '#ff4444' : '#44ff44', color: 'white' }}
                            >
                                {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {stopwatchRunning ? 'Stop' : 'Start'}
                            </Button>
                            <Button
                                onClick={addLap}
                                disabled={!stopwatchRunning}
                                size="lg"
                                className="gap-2"
                                style={{ backgroundColor: stopwatchRunning ? theme.accent : '#cccccc', color: 'white' }}
                            >
                                <Plus className="w-5 h-5" />
                                Lap
                            </Button>
                            <Button onClick={resetStopwatch} size="lg" variant="secondary" className="gap-2">
                                <RotateCcw className="w-5 h-5" />
                                Reset
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={timerRunning ? stopTimer : startTimer}
                                disabled={!timerRunning && timerTime === 0 && (timerMinutes === 0 && timerSeconds === 0)}
                                size="lg"
                                className="gap-2"
                                style={{ backgroundColor: timerRunning ? '#ff4444' : '#44ff44', color: 'white' }}
                            >
                                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {timerRunning ? 'Stop' : 'Start'}
                            </Button>
                            <Button onClick={resetTimer} size="lg" variant="secondary" className="gap-2">
                                <RotateCcw className="w-5 h-5" />
                                Reset
                            </Button>
                        </>
                    )}
                </div>

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

            {!fullScreen && activeTab === 'stopwatch' && lapTimes.length > 0 && (
                <div className="container mx-auto px-4 mb-6 max-w-5xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lap Times</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                {lapTimes.slice().reverse().map((lap) => (
                                    <div
                                        key={lap.id}
                                        className="flex justify-between p-3 bg-muted rounded-lg font-mono text-sm"
                                    >
                                        <span className="font-semibold">Lap {lap.id}</span>
                                        <span>{formatTime(lap.lapTime)}</span>
                                        <span className="text-muted-foreground">{formatTime(lap.time)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Layout>
    );
}
