import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

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
        background: 'var(--ifm-background-color)',
        text: 'var(--ifm-font-color-base)',
        border: 'var(--ifm-color-emphasis-300)',
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

    const getTimeZoneOffset = () => {
        const date = new Date();
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const targetDate = new Date(utc + (getTimezoneOffsetHours() * 3600000));
        return targetDate;
    };

    const getTimezoneOffsetHours = () => {
        // This is a simplified version. In a real app, you'd use a proper timezone library
        const offsets: { [key: string]: number } = {
            'Asia/Seoul': 9,
            'America/New_York': -5,
            'America/Los_Angeles': -8,
            'Europe/London': 0,
            'Europe/Paris': 1,
            'Asia/Tokyo': 9,
            'Asia/Shanghai': 8,
            'Australia/Sydney': 11,
            'UTC': 0,
        };
        return offsets[timezone] || 0;
    };

    const theme = colorThemes[colorTheme];

    const clockStyle: React.CSSProperties = {
        fontSize: `${fontSize}px`,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: theme.text,
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
    };

    const dateStyle: React.CSSProperties = {
        fontSize: `${fontSize * 0.4}px`,
        color: theme.text,
        marginTop: '1rem',
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
    };

    return (
        <Layout title="Digital Clock">
            {!fullScreen && (
                <div className="container margin-vert--lg">
                    <h1>Digital Clock</h1>

                    <div className="card padding--lg margin-bottom--lg">
                        <h3>Clock Settings</h3>

                        <div className="row margin-bottom--md">
                            <div className="col col--3">
                                <label className="margin-bottom--sm">Time Format:</label>
                                <div className="button-group">
                                    <button
                                        className={`button button--sm ${timeFormat === '12' ? 'button--primary' : 'button--secondary'}`}
                                        onClick={() => setTimeFormat('12')}
                                    >
                                        12H
                                    </button>
                                    <button
                                        className={`button button--sm ${timeFormat === '24' ? 'button--primary' : 'button--secondary'}`}
                                        onClick={() => setTimeFormat('24')}
                                    >
                                        24H
                                    </button>
                                </div>
                            </div>

                            <div className="col col--3">
                                <label className="margin-bottom--sm">Timezone:</label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        backgroundColor: 'var(--ifm-background-color)',
                                        color: 'var(--ifm-font-color-base)',
                                    }}
                                >
                                    {timeZones.map((tz) => (
                                        <option key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col col--3">
                                <label className="margin-bottom--sm">Font Size:</label>
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
                                <label className="margin-bottom--sm">Theme:</label>
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
                        </div>

                        <div className="row margin-bottom--md">
                            <div className="col">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={showSeconds}
                                        onChange={(e) => setShowSeconds(e.target.checked)}
                                    />
                                    Show Seconds
                                </label>
                            </div>

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
                                        checked={showDate}
                                        onChange={(e) => setShowDate(e.target.checked)}
                                    />
                                    Show Date
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
                        </div>

                        <button
                            className="button button--primary"
                            onClick={() => setFullScreen(!fullScreen)}
                        >
                            {fullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        </button>
                    </div>
                </div>
            )}

            <div style={clockStyle}>
                <div>{formatTime(currentTime)}</div>
                {showDate && <div style={dateStyle}>{formatDate(currentTime)}</div>}

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
        </Layout>
    );
} 