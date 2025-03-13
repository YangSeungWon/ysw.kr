import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// CSS를 컴포넌트 상단에 추가
const markerStyle = {
    circle: {
        width: '20px',
        height: '20px',
        borderRadius: '50% 50% 50% 0',
        background: '#3388ff',
        position: 'absolute',
        transform: 'rotate(-45deg)',
        left: '50%',
        top: '50%',
        margin: '-15px 0 0 -15px',
        animation: 'bounce 0.5s ease-in-out',
        border: '2px solid white',
        boxShadow: '0 0 6px rgba(0,0,0,0.4)'
    } as const,
    pulse: {
        background: 'rgba(51, 136, 255, 0.2)',
        borderRadius: '50%',
        height: '14px',
        width: '14px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        margin: '-12px 0 0 -12px',
        transform: 'rotateX(55deg)',
    } as const,
};

export default function CoordinatesPage() {
    const [coordinates, setCoordinates] = useState<string>('');
    const [convertedCoordinates, setConvertedCoordinates] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Leaflet only on client-side
        if (typeof window !== 'undefined') {
            const L = require('leaflet');

            if (!mapRef.current && mapContainerRef.current) {
                // Initialize centered on Seoul
                mapRef.current = L.map(mapContainerRef.current).setView([37.5665, 126.9780], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(mapRef.current);

                // 커스텀 마커 아이콘 정의
                const CustomIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
                        width: 20px;
                        height: 20px;
                        border-radius: 50% 50% 50% 0;
                        background: #3388ff;
                        position: relative;
                        transform: rotate(-45deg);
                        border: 2px solid white;
                        box-shadow: 0 0 6px rgba(0,0,0,0.4);
                    "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 20],
                });

                // 지도 클릭 이벤트
                mapRef.current.on('click', (e: any) => {
                    const { lat, lng } = e.latlng;

                    // 마커 업데이트
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        markerRef.current = L.marker([lat, lng], { icon: CustomIcon }).addTo(mapRef.current);
                    }

                    // 좌표 입력값 업데이트
                    setCoordinates(`${lat}, ${lng}`);
                    handleConversion(lat, lng);
                });
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const handleConversion = (lat: number, lon: number) => {
        if (isNaN(lat) || isNaN(lon)) {
            setConvertedCoordinates({ error: 'Invalid coordinate format' });
            return;
        }

        const result = {
            DecimalDegrees: {
                CoordinateFormatString: "DDD.DDDDD°",
                CoordinateString: `${decimalToDD(lat, true)}, ${decimalToDD(lon, false)}`
            },
            DegreesMinutesSeconds: {
                CoordinateFormatString: "DDD° MM' SS.S\"",
                CoordinateString: `${decimalToDMS(lat, true)}, ${decimalToDMS(lon, false)}`
            },
            DegreesMinutes: {
                CoordinateFormatString: "DDD° MM.MMM'",
                CoordinateString: `${decimalToDM(lat, true)}, ${decimalToDM(lon, false)}`
            }
        };

        setConvertedCoordinates(result);
    };

    const convertCoordinates = () => {
        const [lat, lon] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
        handleConversion(lat, lon);

        // 지도 마커 업데이트
        if (mapRef.current) {
            const L = require('leaflet');
            const CustomIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50% 50% 50% 0;
                    background: #3388ff;
                    position: relative;
                    transform: rotate(-45deg);
                    border: 2px solid white;
                    box-shadow: 0 0 6px rgba(0,0,0,0.4);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 20],
            });

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lon]);
            } else {
                markerRef.current = L.marker([lat, lon], { icon: CustomIcon }).addTo(mapRef.current);
            }
            mapRef.current.setView([lat, lon], 13);
        }
    };

    const getCurrentLocation = () => {
        setIsLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinates(`${latitude}, ${longitude}`);
                    handleConversion(latitude, longitude);

                    // 지도 업데이트
                    if (mapRef.current) {
                        const L = require('leaflet');
                        const CustomIcon = L.divIcon({
                            className: 'custom-marker',
                            html: `<div style="
                                width: 20px;
                                height: 20px;
                                border-radius: 50% 50% 50% 0;
                                background: #3388ff;
                                position: relative;
                                transform: rotate(-45deg);
                                border: 2px solid white;
                                box-shadow: 0 0 6px rgba(0,0,0,0.4);
                            "></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 20],
                        });

                        if (markerRef.current) {
                            markerRef.current.setLatLng([latitude, longitude]);
                        } else {
                            markerRef.current = L.marker([latitude, longitude], { icon: CustomIcon }).addTo(mapRef.current);
                        }
                        mapRef.current.setView([latitude, longitude], 13);
                    }
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Failed to get location. Please check location permissions.");
                    setIsLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported in this browser.");
            setIsLoading(false);
        }
    };

    // Utility functions for coordinate conversion
    const decimalToDMS = (deg: number, isLat: boolean) => {
        const d = Math.floor(Math.abs(deg));
        const minFloat = (Math.abs(deg) - d) * 60;
        const m = Math.floor(minFloat);
        const s = ((minFloat - m) * 60).toFixed(1);
        const direction = deg >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
        return `${direction} ${d}° ${m}' ${s}″`;
    };

    const decimalToDM = (deg: number, isLat: boolean) => {
        const d = Math.floor(Math.abs(deg));
        const minFloat = (Math.abs(deg) - d) * 60;
        const direction = deg >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
        return `${direction} ${d}° ${minFloat.toFixed(3)}′`;
    };

    const decimalToDD = (deg: number, isLat: boolean) => {
        const direction = deg >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
        return `${direction} ${Math.abs(deg).toFixed(5)}°`;
    };

    return (
        <Layout title="Coordinate Conversion Tool">
            <div className="container">
                <h1>Coordinate Conversion Tool</h1>
                <div style={{ marginBottom: '20px' }}>
                    <Input
                        type="text"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        placeholder="Enter coordinates (e.g., 36.009400, 129.323933)"
                        className="form-input"
                        style={{ marginRight: '10px' }}
                    />
                    <Button onClick={convertCoordinates} className="button button--primary" style={{ marginRight: '10px' }}>
                        Convert
                    </Button>
                    <Button
                        onClick={getCurrentLocation}
                        className="button button--secondary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Getting location..." : "Get Current Location"}
                    </Button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
                    <p className="margin-top--sm">Click on the map to select coordinates.</p>
                </div>

                {convertedCoordinates && !convertedCoordinates.error && (
                    <div className="margin-top--md">
                        <p><strong>Input Coordinates:</strong> {coordinates}</p>
                        <hr style={{ margin: '10px 0' }} />
                        <p><strong>Decimal Degrees (DD):</strong> {convertedCoordinates.DecimalDegrees.CoordinateString}</p>
                        <p><strong>Degrees Minutes Seconds (DMS):</strong> {convertedCoordinates.DegreesMinutesSeconds.CoordinateString}</p>
                        <p><strong>Degrees Minutes (DM):</strong> {convertedCoordinates.DegreesMinutes.CoordinateString}</p>
                    </div>
                )}
                {convertedCoordinates?.error && (
                    <p className="margin-top--md text--danger">{convertedCoordinates.error}</p>
                )}
            </div>
        </Layout>
    );
} 