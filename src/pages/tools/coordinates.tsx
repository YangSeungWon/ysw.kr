import React, { useState, useEffect, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { toast, Toaster } from 'sonner';

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

                // Custom marker icon
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

                // Map click event
                mapRef.current.on('click', (e: any) => {
                    const { lat, lng } = e.latlng;

                    // Update marker
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        markerRef.current = L.marker([lat, lng], { icon: CustomIcon }).addTo(mapRef.current);
                    }

                    // Update coordinates input
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
            toast.error('Invalid coordinate format');
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

        // Update map marker
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

                    // Update map
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
                    toast.success('Location retrieved successfully');
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error('Failed to get location. Please check location permissions.');
                    setIsLoading(false);
                }
            );
        } else {
            toast.error('Geolocation is not supported in this browser');
            setIsLoading(false);
        }
    };

    const copyCoordinate = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Coordinate copied to clipboard');
        }).catch(() => {
            toast.error('Failed to copy coordinate');
        });
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
        <ToolLayout
            title="Coordinate Conversion Tool"
            description="Convert GPS coordinates to multiple formats"
            icon={<MapPin className="h-8 w-8 text-primary" />}
            maxWidth="max-w-5xl"
        >
            <Toaster />
            <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Enter Coordinates</CardTitle>
                        <CardDescription>
                            Enter coordinates or click on the map to select a location
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Input
                                type="text"
                                value={coordinates}
                                onChange={(e) => setCoordinates(e.target.value)}
                                placeholder="Enter coordinates (e.g., 36.009400, 129.323933)"
                                className="flex-1 min-w-[250px]"
                            />
                            <Button onClick={convertCoordinates} variant="docusaurus" className="gap-2">
                                <MapPin className="w-4 h-4" />
                                Convert
                            </Button>
                            <Button
                                onClick={getCurrentLocation}
                                variant="docusaurus"
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <Navigation className="w-4 h-4" />
                                {isLoading ? "Getting location..." : "Get Current Location"}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div ref={mapContainerRef} className="h-[400px] w-full rounded-lg border" />
                            <p className="text-sm text-muted-foreground">
                                💡 Click on the map to select coordinates
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {convertedCoordinates && !convertedCoordinates.error && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Converted Coordinates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Input Coordinates</div>
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <code className="text-sm">{coordinates}</code>
                                    <Button
                                        variant="docusaurus"
                                        size="sm"
                                        onClick={() => copyCoordinate(coordinates)}
                                        className="gap-2"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-3">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Decimal Degrees (DD)
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <code className="text-sm">{convertedCoordinates.DecimalDegrees.CoordinateString}</code>
                                        <Button
                                            variant="docusaurus"
                                            size="sm"
                                            onClick={() => copyCoordinate(convertedCoordinates.DecimalDegrees.CoordinateString)}
                                            className="gap-2"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Degrees Minutes Seconds (DMS)
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <code className="text-sm">{convertedCoordinates.DegreesMinutesSeconds.CoordinateString}</code>
                                        <Button
                                            variant="docusaurus"
                                            size="sm"
                                            onClick={() => copyCoordinate(convertedCoordinates.DegreesMinutesSeconds.CoordinateString)}
                                            className="gap-2"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Degrees Minutes (DM)
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <code className="text-sm">{convertedCoordinates.DegreesMinutes.CoordinateString}</code>
                                        <Button
                                            variant="docusaurus"
                                            size="sm"
                                            onClick={() => copyCoordinate(convertedCoordinates.DegreesMinutes.CoordinateString)}
                                            className="gap-2"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
        </ToolLayout>
    );
}
