"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Mic, Speaker, Play, Square, RefreshCw, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import WaveSurfer from "wavesurfer.js"
import Layout from "@theme/Layout"

// Custom Waveform component
const Waveform = React.memo(({ url, onReady, isRecording, audioStream, setIsPlaying, audioRef }: {
    url: string;
    onReady: () => void;
    isRecording: boolean;
    audioStream?: MediaStream;
    setIsPlaying: (isPlaying: boolean) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const startTimeRef = useRef<number>(0)
    const customCursorRef = useRef<HTMLDivElement>(null)
    const MAX_DURATION = 10 // Maximum duration in seconds
    const BUFFER_SIZE = 2048 // Size of each audio buffer

    // Initialize and connect audio nodes for real-time visualization
    useEffect(() => {
        if (isRecording && audioStream) {
            console.log('Setting up live visualization for recording')

            // Clean up previous instances
            if (audioContextRef.current) {
                audioContextRef.current.close()
                analyserRef.current = null
                sourceRef.current = null
            }

            // Reset start time
            startTimeRef.current = Date.now()

            // Create new audio context and nodes
            audioContextRef.current = new AudioContext()
            analyserRef.current = audioContextRef.current.createAnalyser()
            sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream)

            // Configure analyser
            analyserRef.current.fftSize = BUFFER_SIZE
            analyserRef.current.smoothingTimeConstant = 0.8

            // Connect nodes: source -> analyser
            sourceRef.current.connect(analyserRef.current)

            // Start animation frame
            requestAnimationFrame(drawWaveform)

            console.log('Audio visualization pipeline created')
        }

        return () => {
            // Clean up
            if (sourceRef.current) {
                sourceRef.current.disconnect()
                sourceRef.current = null
            }

            if (audioContextRef.current) {
                audioContextRef.current.close()
                audioContextRef.current = null
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }
        }
    }, [isRecording, audioStream])

    // Draw waveform to canvas during recording
    const drawWaveform = useCallback(() => {
        if (!analyserRef.current || !canvasRef.current || !isRecording) {
            return
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Get canvas dimensions
        const width = canvas.width
        const height = canvas.height

        // Get audio data
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Float32Array(bufferLength)
        analyserRef.current.getFloatTimeDomainData(dataArray)

        // Calculate average volume
        const averageVolume = dataArray.reduce((acc, val) => acc + Math.abs(val), 0) / bufferLength
        const normalizedVolume = Math.min(averageVolume * 2, 1) // Scale up and clamp to 1

        // Clear canvas
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, width, height)

        // Draw background bar with subtle gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Draw volume bar with gradient
        const barWidth = width * normalizedVolume
        const barGradient = ctx.createLinearGradient(0, 0, barWidth, 0)
        barGradient.addColorStop(0, '#6366f1') // indigo-500
        barGradient.addColorStop(1, '#8b5cf6') // violet-500
        ctx.fillStyle = barGradient
        ctx.fillRect(0, 0, barWidth, height)

        // Draw progress indicator
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000
        const progress = Math.min(elapsedTime / MAX_DURATION, 1)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillRect(width * progress, 0, 2, height)

        // Continue animation loop
        if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(drawWaveform)
        }
    }, [isRecording])

    // Initialize WaveSurfer for playback
    useEffect(() => {
        if (!containerRef.current || isRecording) return

        if (wavesurferRef.current) {
            wavesurferRef.current.destroy()
        }

        const wavesurfer = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#4f46e5',
            progressColor: '#4338ca',
            barWidth: 4,
            barRadius: 3,
            height: 100,
            barGap: 4,
            normalize: true,
            barHeight: 0.8,
        })

        wavesurfer.on('ready', () => {
            console.log('WaveSurfer is ready')
            onReady()
        })

        wavesurfer.on('audioprocess', (time) => {
            if (customCursorRef.current && containerRef.current) {
                const duration = wavesurfer.getDuration()
                const containerWidth = containerRef.current.offsetWidth
                const progress = Math.min(time / duration, 1)
                const cursorX = containerWidth * progress
                customCursorRef.current.style.transform = `translateX(${cursorX}px)`
            }
        })

        wavesurfer.on('finish', () => {
            console.log('WaveSurfer: Playback finished')
            wavesurfer.pause()
            wavesurfer.seekTo(0)
            if (customCursorRef.current) {
                customCursorRef.current.style.transform = 'translateX(0)'
            }
            setIsPlaying(false)
        })

        wavesurfer.on('error', (err) => {
            console.error('WaveSurfer error:', err)
        })

        wavesurferRef.current = wavesurfer

        return () => {
            wavesurfer.destroy()
        }
    }, [onReady, isRecording])

    // Fallback audio element event handler
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => {
                console.log('Audio element: Playback finished')
                setIsPlaying(false)
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.onended = null
            }
        }
    }, [])

    // Load audio into WaveSurfer when URL changes
    useEffect(() => {
        if (wavesurferRef.current && url && !isRecording) {
            console.log('Loading audio into WaveSurfer:', url)
            wavesurferRef.current.load(url)
        }
    }, [url, isRecording])

    return (
        <div className="w-full rounded-lg overflow-hidden bg-gray-100 p-4" style={{ minHeight: '100px' }}>
            {isRecording ? (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <div className="relative">
                            <Mic className="w-5 h-5 animate-pulse" />
                            <div className="absolute inset-0 rounded-full ring-2 ring-indigo-500/50 animate-ping" />
                        </div>
                        <span className="text-sm font-medium">Recording in progress...</span>
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={40}
                        className="w-full h-10 rounded-lg shadow-inner"
                    />
                    <div className="text-xs text-gray-500 text-center">
                        Speak into your microphone to see the volume level
                    </div>
                </div>
            ) : (
                <div className="relative" style={{ minHeight: '100px' }}>
                    <div
                        ref={customCursorRef}
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 transition-transform duration-100"
                        style={{ transform: 'translateX(0)' }}
                    />
                    <div ref={containerRef} />
                </div>
            )}
        </div>
    )
})

Waveform.displayName = 'Waveform'

export default function AudioChecker() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
    const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")
    const [selectedSpeaker, setSelectedSpeaker] = useState<string>("")
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [isTestingSpeaker, setIsTestingSpeaker] = useState<boolean>(false)
    const [isWaveformReady, setIsWaveformReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioStreamRef = useRef<MediaStream | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const testAudioRef = useRef<HTMLAudioElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)

    const handleWaveformReady = useCallback(() => {
        console.log('Waveform ready callback')
        setIsWaveformReady(true)
    }, [])

    useEffect(() => {
        requestPermissions()
    }, [])

    const requestPermissions = async () => {
        setLoading(true)
        setError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach((track) => track.stop())
            setPermissionGranted(true)
            await updateDeviceList()
        } catch (error) {
            console.error("Error requesting permissions:", error)
            setError("Could not access microphone. Please check your permissions.")
        } finally {
            setLoading(false)
        }
    }

    const updateDeviceList = async () => {
        try {
            const deviceList = await navigator.mediaDevices.enumerateDevices()
            const audioDevices = deviceList.filter((device) => device.kind === "audioinput" || device.kind === "audiooutput")
            setDevices(audioDevices)

            const defaultInput = audioDevices.find((d) => d.kind === "audioinput")
            const defaultOutput = audioDevices.find((d) => d.kind === "audiooutput")

            if (defaultInput) setSelectedMicrophone(defaultInput.deviceId)
            if (defaultOutput) setSelectedSpeaker(defaultOutput.deviceId)
        } catch (error) {
            console.error("Error updating device list:", error)
            setError("Could not enumerate audio devices.")
        }
    }

    const startRecording = async () => {
        try {
            setError(null)
            // Clean up previous recordings
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
                setAudioUrl("")
            }

            // Reset states
            setIsPlaying(false)
            if (wavesurferRef.current) {
                wavesurferRef.current.pause()
                wavesurferRef.current.seekTo(0)
            }

            // Reset chunks
            chunksRef.current = []

            // Get media stream with specific constraints
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedMicrophone,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    channelCount: 1,
                    sampleRate: 44100,
                    sampleSize: 16
                },
            })

            // Verify audio track
            const audioTracks = stream.getAudioTracks()
            if (audioTracks.length === 0) {
                throw new Error("No audio track available")
            }

            const audioTrack = audioTracks[0]
            if (audioTrack.readyState !== 'live') {
                throw new Error("Audio track is not live")
            }

            // Add event listeners to track state changes
            audioTrack.onended = () => {
                console.error("Audio track ended unexpectedly")
                setError("Audio track ended unexpectedly")
                stopRecording()
            }

            audioTrack.onmute = () => {
                console.error("Audio track muted")
                setError("Audio track was muted")
            }

            // Store the stream
            audioStreamRef.current = stream
            console.log('Got media stream:', stream)
            console.log('Stream active:', stream.active)
            console.log('Audio tracks:', audioTracks)
            console.log('Audio track settings:', audioTrack.getSettings())

            // Create MediaRecorder with minimal configuration
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // Simplified MIME type
            })
            mediaRecorderRef.current = mediaRecorder

            // Set up event handlers
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                    console.log('Received audio chunk:', e.data.size, 'bytes')
                    console.log('Total chunks:', chunksRef.current.length)
                    console.log('Total size:', chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0), 'bytes')
                }
            }

            mediaRecorder.onstop = () => {
                // Create blob from chunks
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                const url = URL.createObjectURL(blob)
                console.log('Created audio URL:', url)
                console.log('Final blob size:', blob.size, 'bytes')
                setAudioUrl(url)

                // Stop all tracks
                stream.getTracks().forEach(track => {
                    track.stop()
                    track.onended = null
                    track.onmute = null
                })
                audioStreamRef.current = null
            }

            // Start recording without timeslice
            mediaRecorder.start()
            console.log('MediaRecorder started')
            setIsRecording(true)

            // Wait for initial data to ensure recording has started properly
            await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
            console.error("Error starting recording:", error)
            setError(`Failed to start recording: ${error.message}`)
            // Clean up if something went wrong
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop())
                audioStreamRef.current = null
            }
        }
    }

    const stopRecording = () => {
        console.log('Stopping recording...')
        if (mediaRecorderRef.current && isRecording) {
            // Request final data chunk
            mediaRecorderRef.current.requestData()
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            console.log('Recording stopped')
        }
    }

    const playRecording = () => {
        if (!audioUrl || !isWaveformReady || isRecording) {
            console.error('Cannot play: WaveSurfer not ready or recording in progress')
            setError('Cannot play recording at this time')
            return
        }

        console.log('Playing recording...')
        if (wavesurferRef.current) {
            wavesurferRef.current.play()
            setIsPlaying(true)
        } else if (audioRef.current) {
            audioRef.current.src = audioUrl
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    const stopPlaying = () => {
        console.log('Stopping playback...')
        if (wavesurferRef.current) {
            wavesurferRef.current.pause()
            wavesurferRef.current.seekTo(0)
        } else if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setIsPlaying(false)
    }

    const downloadRecording = () => {
        if (audioUrl) {
            const a = document.createElement('a')
            a.href = audioUrl
            a.download = 'audio-recording.webm'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
    }

    const testSpeaker = async () => {
        if (isTestingSpeaker) {
            if (testAudioRef.current) {
                testAudioRef.current.pause()
                testAudioRef.current.currentTime = 0
            }
            setIsTestingSpeaker(false)
            return
        }

        try {
            setError(null)
            const testAudio = new Audio('https://li.me.kr/assets/audio/bgm.ogg')
            testAudioRef.current = testAudio

            if (selectedSpeaker && testAudio.setSinkId) {
                await testAudio.setSinkId(selectedSpeaker)
            }

            testAudio.play()
            setIsTestingSpeaker(true)

            testAudio.onended = () => {
                setIsTestingSpeaker(false)
            }
        } catch (error) {
            console.error("Error testing speaker:", error)
            setError("Failed to test speaker. Please check your audio settings.")
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-12 px-4">
                <div className="flex items-center justify-center h-[60vh]">
                    Please grant permission to access your microphone and speakers.
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (!permissionGranted) {
        return (
            <div className="container mx-auto max-w-4xl py-12 px-4">
                <h1 className="text-3xl font-bold mb-8">Audio Device Checker</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Permission Required</CardTitle>
                        <CardDescription>This tool needs permission to access your microphone and speakers.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={requestPermissions}>Grant Permission</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <Layout title="Audio Device Checker">
            <div className="container mx-auto max-w-4xl py-12 px-4">
                <h1 className="text-3xl font-bold mb-8">Audio Device Checker</h1>

                {error && (
                    <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="h-5 w-5" />
                                Microphones
                            </CardTitle>
                            <CardDescription>Select the microphone you want to test</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a microphone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {devices
                                        .filter((device) => device.kind === "audioinput")
                                        .map((device) => (
                                            <SelectItem key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Microphone ${device.deviceId.substring(0, 5)}...`}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Speaker className="h-5 w-5" />
                                Speakers
                            </CardTitle>
                            <CardDescription>Select the speaker for playback</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a speaker" />
                                </SelectTrigger>
                                <SelectContent>
                                    {devices
                                        .filter((device) => device.kind === "audiooutput")
                                        .map((device) => (
                                            <SelectItem key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Speaker ${device.deviceId.substring(0, 5)}...`}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={isTestingSpeaker ? "destructive" : "default"}
                                onClick={testSpeaker}
                                className="flex items-center gap-2"
                            >
                                {isTestingSpeaker ? (
                                    <>
                                        <Square className="h-4 w-4" />
                                        Stop Speaker Test
                                    </>
                                ) : (
                                    <>
                                        <Speaker className="h-4 w-4" />
                                        Test Speaker
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Recording</CardTitle>
                        <CardDescription>
                            Record audio from your selected microphone and play it back through your selected speaker
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant={isRecording ? "destructive" : "default"}
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={!selectedMicrophone}
                                    className={`flex items-center gap-2 transition-all duration-200 ${isRecording ? "bg-red-600 hover:bg-red-700" : "hover:bg-indigo-700"
                                        }`}
                                >
                                    {isRecording ? (
                                        <>
                                            <Square className="w-4 h-4" />
                                            Stop Recording
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-4 h-4" />
                                            {audioUrl ? "Record Again" : "Start Recording"}
                                        </>
                                    )}
                                </Button>

                                {audioUrl && !isRecording && (
                                    <>
                                        <Button
                                            variant={isPlaying ? "destructive" : "default"}
                                            onClick={isPlaying ? stopPlaying : playRecording}
                                            disabled={!isWaveformReady}
                                            className={`flex items-center gap-2 transition-all duration-200 ${isPlaying ? "bg-red-600 hover:bg-red-700" : "hover:bg-indigo-700"
                                                }`}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <Square className="w-4 h-4" />
                                                    Stop Playback
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    Play Recording
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={downloadRecording}
                                            className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Recording
                                        </Button>
                                    </>
                                )}
                            </div>

                            {!selectedMicrophone && (
                                <div className="text-sm text-gray-500 mt-2">
                                    Please select a microphone to start recording
                                </div>
                            )}

                            {(audioUrl || isRecording) && (
                                <div className="mt-4">
                                    <Waveform
                                        url={audioUrl}
                                        onReady={handleWaveformReady}
                                        isRecording={isRecording}
                                        audioStream={audioStreamRef.current || undefined}
                                        setIsPlaying={setIsPlaying}
                                        audioRef={audioRef}
                                    />
                                    <Alert className="mt-4">
                                        <AlertDescription>
                                            {isRecording
                                                ? "Recording in progress... Speak into your microphone to see the volume level."
                                                : isPlaying
                                                    ? "Playing your recording..."
                                                    : "Recording is ready for playback. Click the play button to hear your recording."}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Hidden audio element for fallback playback */}
                <audio ref={audioRef} style={{ display: 'none' }} />
            </div>
        </Layout>
    )
}