import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import 'leaflet/dist/leaflet.css';

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
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Leaflet를 클라이언트 사이드에서만 초기화
        if (typeof window !== 'undefined') {
            const L = require('leaflet');

            if (!mapRef.current && mapContainerRef.current) {
                // 서울 중심으로 초기화
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
            setConvertedCoordinates({ error: '잘못된 좌표 형식입니다' });
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
        <Layout title="좌표 변환 도구">
            <div className="container">
                <h1>좌표 변환 도구</h1>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        placeholder="좌표 입력 (예: 36.009400, 129.323933)"
                        className="form-input"
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={convertCoordinates} className="button button--primary">
                        변환
                    </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
                    <p className="margin-top--sm">지도를 클릭하여 좌표를 선택할 수 있습니다.</p>
                </div>

                {convertedCoordinates && !convertedCoordinates.error && (
                    <div className="margin-top--md">
                        <p><strong>입력된 좌표:</strong> {coordinates}</p>
                        <hr style={{ margin: '10px 0' }} />
                        <p><strong>십진수 좌표 (DD):</strong> {convertedCoordinates.DecimalDegrees.CoordinateString}</p>
                        <p><strong>도분초 좌표 (DMS):</strong> {convertedCoordinates.DegreesMinutesSeconds.CoordinateString}</p>
                        <p><strong>도분 좌표 (DM):</strong> {convertedCoordinates.DegreesMinutes.CoordinateString}</p>
                    </div>
                )}
                {convertedCoordinates?.error && (
                    <p className="margin-top--md text--danger">{convertedCoordinates.error}</p>
                )}
            </div>
        </Layout>
    );
} 