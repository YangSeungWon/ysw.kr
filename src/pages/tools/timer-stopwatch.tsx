import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';

const colorThemes = {
    default: {
        background: 'var(--ifm-background-color)',
        text: 'var(--ifm-font-color-base)',
        border: 'var(--ifm-color-emphasis-300)',
        accent: 'var(--ifm-color-primary)',
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
    // Common states
    const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [fontSize, setFontSize] = useState(48);
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [showMilliseconds, setShowMilliseconds] = useState(true);
    const [showBorder, setShowBorder] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Stopwatch states
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
    const [lapCounter, setLapCounter] = useState(0);

    // Timer states
    const [timerMinutes, setTimerMinutes] = useState(5);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerTime, setTimerTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBDWR2e/IeSEFKXrI7+GOTA0PVqHj8bllHgg2jdXzzn0vBSF+zPLaizsIGGS57+OZSA0PUqPl9LdnHghAjdv5xoYrBSuG0+6fXBoSQA==');
        audioRef.current.volume = 0.3;
    }, []);

    // Stopwatch effect
    useEffect(() => {
        if (stopwatchRunning) {
            intervalRef.current = setInterval(() => {
                setStopwatchTime(prev => prev + (showMilliseconds ? 10 : 1000));
            }, showMilliseconds ? 10 : 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [stopwatchRunning, showMilliseconds]);

    // Timer effect
    useEffect(() => {
        if (timerRunning && timerTime > 0) {
            intervalRef.current = setInterval(() => {
                setTimerTime(prev => {
                    if (prev <= (showMilliseconds ? 10 : 1000)) {
                        setTimerRunning(false);
                        setTimerFinished(true);
                        if (soundEnabled && audioRef.current) {
                            audioRef.current.play().catch(console.error);
                        }
                        return 0;
                    }
                    return prev - (showMilliseconds ? 10 : 1000);
                });
            }, showMilliseconds ? 10 : 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
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

    const startStopwatch = () => {
        setStopwatchRunning(true);
    };

    const stopStopwatch = () => {
        setStopwatchRunning(false);
    };

    const resetStopwatch = () => {
        setStopwatchRunning(false);
        setStopwatchTime(0);
        setLapTimes([]);
        setLapCounter(0);
    };

    const addLap = () => {
        if (stopwatchRunning) {
            const newLapCounter = lapCounter + 1;
            const lapTime = lapTimes.length > 0
                ? stopwatchTime - lapTimes[lapTimes.length - 1].time
                : stopwatchTime;

            setLapTimes(prev => [...prev, {
                id: newLapCounter,
                time: stopwatchTime,
                lapTime: lapTime
            }]);
            setLapCounter(newLapCounter);
        }
    };

    const startTimer = () => {
        if (timerTime === 0) {
            setTimerTime((timerMinutes * 60 + timerSeconds) * 1000);
        }
        setTimerRunning(true);
        setTimerFinished(false);
    };

    const stopTimer = () => {
        setTimerRunning(false);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTimerTime(0);
        setTimerFinished(false);
    };

    const theme = colorThemes[colorTheme];

    const displayStyle: React.CSSProperties = {
        fontSize: `${fontSize}px`,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: timerFinished ? '#ff4444' : theme.text,
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: theme.background,
        border: showBorder ? `2px solid ${theme.border}` : 'none',
        borderRadius: '12px',
        minHeight: fullScreen ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: colorTheme !== 'default' ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
        animation: timerFinished ? 'pulse 1s infinite' : 'none',
    };

    const buttonStyle = {
        margin: '0.5rem',
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
    };

    return (
        <Layout title="Timer & Stopwatch">
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

            {!fullScreen && (
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <h1>Timer & Stopwatch</h1>

                    <div className="card p-6 mb-6">
                        <h3>Settings</h3>

                        <div className="row mb-4">
                            <div className="col col--3">
                                <label className="mb-2">Mode:</label>
                                <div className="inline-flex">
                                    <Button
                                        size="sm"
                                        variant={activeTab === 'stopwatch' ? 'default' : 'secondary'}
                                        onClick={() => setActiveTab('stopwatch')}
                                        className="rounded-r-none"
                                    >
                                        Stopwatch
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={activeTab === 'timer' ? 'default' : 'secondary'}
                                        onClick={() => setActiveTab('timer')}
                                        className="rounded-l-none"
                                    >
                                        Timer
                                    </Button>
                                </div>
                            </div>

                            <div className="col col--3">
                                <label className="mb-2">Font Size:</label>
                                <input
                                    type="range"
                                    min="24"
                                    max="120"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                                <small>{fontSize}px</small>
                            </div>

                            <div className="col col--3">
                                <label className="mb-2">Theme:</label>
                                <select
                                    value={colorTheme}
                                    onChange={(e) => setColorTheme(e.target.value as keyof typeof colorThemes)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        backgroundColor: 'var(--ifm-background-color)',
                                        color: 'var(--ifm-font-color-base)',
                                    }}
                                >
                                    <option value="default">Default</option>
                                    <option value="neon">Neon</option>
                                    <option value="retro">Retro</option>
                                    <option value="matrix">Matrix</option>
                                    <option value="sunset">Sunset</option>
                                </select>
                            </div>

                            <div className="col col--3">
                                <Button
                                    onClick={() => setFullScreen(!fullScreen)}
                                >
                                    Fullscreen
                                </Button>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={showMilliseconds}
                                        onChange={(e) => setShowMilliseconds(e.target.checked)}
                                    />
                                    Show Milliseconds
                                </label>
                            </div>

                            <div className="col">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={showBorder}
                                        onChange={(e) => setShowBorder(e.target.checked)}
                                    />
                                    Show Border
                                </label>
                            </div>

                            <div className="col">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={soundEnabled}
                                        onChange={(e) => setSoundEnabled(e.target.checked)}
                                    />
                                    Sound Alerts
                                </label>
                            </div>
                        </div>

                        {activeTab === 'timer' && (
                            <div className="row mb-4">
                                <div className="col col--6">
                                    <label className="mb-2">Timer Duration:</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerMinutes}
                                            onChange={(e) => setTimerMinutes(Number(e.target.value))}
                                            disabled={timerRunning}
                                            style={{
                                                width: '80px',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid var(--ifm-color-emphasis-300)',
                                                backgroundColor: 'var(--ifm-background-color)',
                                                color: 'var(--ifm-font-color-base)',
                                            }}
                                        />
                                        <span>minutes</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerSeconds}
                                            onChange={(e) => setTimerSeconds(Number(e.target.value))}
                                            disabled={timerRunning}
                                            style={{
                                                width: '80px',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid var(--ifm-color-emphasis-300)',
                                                backgroundColor: 'var(--ifm-background-color)',
                                                color: 'var(--ifm-font-color-base)',
                                            }}
                                        />
                                        <span>seconds</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={displayStyle}>
                <div>
                    {activeTab === 'stopwatch' ? formatTime(stopwatchTime) : formatTime(timerTime)}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    {activeTab === 'stopwatch' ? (
                        <>
                            <button
                                onClick={stopwatchRunning ? stopStopwatch : startStopwatch}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: stopwatchRunning ? '#ff4444' : '#44ff44',
                                    color: 'white',
                                }}
                            >
                                {stopwatchRunning ? 'Stop' : 'Start'}
                            </button>
                            <button
                                onClick={addLap}
                                disabled={!stopwatchRunning}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: stopwatchRunning ? theme.accent : '#cccccc',
                                    color: 'white',
                                }}
                            >
                                Lap
                            </button>
                            <button
                                onClick={resetStopwatch}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#666666',
                                    color: 'white',
                                }}
                            >
                                Reset
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={timerRunning ? stopTimer : startTimer}
                                disabled={!timerRunning && timerTime === 0 && (timerMinutes === 0 && timerSeconds === 0)}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: timerRunning ? '#ff4444' : '#44ff44',
                                    color: 'white',
                                }}
                            >
                                {timerRunning ? 'Stop' : 'Start'}
                            </button>
                            <button
                                onClick={resetTimer}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#666666',
                                    color: 'white',
                                }}
                            >
                                Reset
                            </button>
                        </>
                    )}
                </div>

                {fullScreen && (
                    <button
                        onClick={() => setFullScreen(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            padding: '10px 20px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Exit Fullscreen
                    </button>
                )}
            </div>

            {!fullScreen && activeTab === 'stopwatch' && lapTimes.length > 0 && (
                <div className="container mx-auto px-4 mb-6 max-w-5xl">
                    <div className="card p-6">
                        <h3>Lap Times</h3>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {lapTimes.slice().reverse().map((lap, index) => (
                                <div
                                    key={lap.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        borderBottom: index < lapTimes.length - 1 ? '1px solid var(--ifm-color-emphasis-300)' : 'none',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    <span>Lap {lap.id}</span>
                                    <span>{formatTime(lap.lapTime)}</span>
                                    <span>{formatTime(lap.time)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
} 