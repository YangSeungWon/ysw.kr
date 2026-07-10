"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Volume2, Play, Pause, Square } from "lucide-react"
import ToolLayout from "@/components/ToolLayout"

interface Sentence {
    start: number
    end: number
    text: string
    lang: "ko" | "en"
}

interface VoiceEntry {
    voice: SpeechSynthesisVoice
    idx: number
}

// 프리미엄(자연스러운) 목소리일수록 높은 점수. 네트워크/Neural/Premium 계열 우대.
function premiumScore(v: SpeechSynthesisVoice): number {
    let s = 0
    const n = v.name.toLowerCase()
    if (!v.localService) s += 4 // 네트워크(클라우드) 목소리
    if (/natural|neural/.test(n)) s += 5 // MS Natural, Neural
    if (/premium|enhanced/.test(n)) s += 3 // Apple Premium/Enhanced
    if (/online/.test(n)) s += 2
    if (/google/.test(n)) s += 2
    if (/siri/.test(n)) s += 2
    return s
}

function isPremium(v: SpeechSynthesisVoice): boolean {
    return premiumScore(v) >= 3
}

// 문장의 우세 언어를 감지한다 (한글 vs 라틴 문자 수 비교).
function detectLang(text: string): "ko" | "en" {
    const hangul = (text.match(/[가-힣ᄀ-ᇿ㄰-㆏]/g) || []).length
    const latin = (text.match(/[a-zA-Z]/g) || []).length
    if (hangul === 0 && latin === 0) return "ko" // 숫자/기호만 → 기본 한국어
    return hangul >= latin ? "ko" : "en"
}

// 문장 단위로 분할하며 원본 텍스트 내 위치와 언어를 보존한다.
function buildSentences(text: string): Sentence[] {
    const res: Sentence[] = []
    const re = /[^.!?。！？\n]*[.!?。！？\n]+|[^.!?。！？\n]+$/g
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
        if (m[0].trim().length === 0) continue
        res.push({ start: m.index, end: m.index + m[0].length, text: m[0], lang: detectLang(m[0]) })
    }
    if (!res.length && text.length) res.push({ start: 0, end: text.length, text, lang: detectLang(text) })
    return res
}

export default function TtsReader() {
    const [supported, setSupported] = useState(true)
    const [text, setText] = useState("")
    const [fullText, setFullText] = useState("")
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedKo, setSelectedKo] = useState("")
    const [selectedEn, setSelectedEn] = useState("")
    const [rate, setRate] = useState(1)
    const [pitch, setPitch] = useState(1)
    const [sentences, setSentences] = useState<Sentence[]>([])
    const [activeIdx, setActiveIdx] = useState(-1)
    const [showReader, setShowReader] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [status, setStatus] = useState("")

    const genRef = useRef(0) // 재생 세션 토큰 (정지/재시작 시 콜백 무효화)
    const activeSpanRef = useRef<HTMLSpanElement | null>(null)

    // 콜백에서 최신 값을 읽기 위한 ref
    const stateRef = useRef({ rate, pitch, selectedKo, selectedEn, voices, sentences })
    stateRef.current = { rate, pitch, selectedKo, selectedEn, voices, sentences }

    // 목소리 로드
    useEffect(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            setSupported(false)
            return
        }
        const synth = window.speechSynthesis
        const load = () => {
            const v = synth.getVoices()
            if (v.length) setVoices(v)
        }
        load()
        synth.addEventListener("voiceschanged", load)
        return () => {
            synth.removeEventListener("voiceschanged", load)
            synth.cancel()
        }
    }, [])

    // 프리미엄 우선 정렬된 언어별 목소리 목록
    const koVoices = useMemo<VoiceEntry[]>(() => {
        return voices
            .map((voice, idx) => ({ voice, idx }))
            .filter((e) => e.voice.lang.toLowerCase().startsWith("ko"))
            .sort((a, b) => premiumScore(b.voice) - premiumScore(a.voice) || a.voice.name.localeCompare(b.voice.name))
    }, [voices])

    const enVoices = useMemo<VoiceEntry[]>(() => {
        return voices
            .map((voice, idx) => ({ voice, idx }))
            .filter((e) => e.voice.lang.toLowerCase().startsWith("en"))
            .sort((a, b) => premiumScore(b.voice) - premiumScore(a.voice) || a.voice.name.localeCompare(b.voice.name))
    }, [voices])

    // 목소리가 로드되면 기본값 선택
    useEffect(() => {
        if (koVoices.length && !selectedKo) setSelectedKo(String(koVoices[0].idx))
    }, [koVoices, selectedKo])

    useEffect(() => {
        if (enVoices.length && !selectedEn) setSelectedEn(String(enVoices[0].idx))
    }, [enVoices, selectedEn])

    // 활성 문장을 화면 안으로 스크롤
    useEffect(() => {
        activeSpanRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }, [activeIdx])

    // 감지된 언어에 맞는 선택된 목소리를 반환 (없으면 다른 언어로 폴백).
    const voiceForLang = useCallback((lang: "ko" | "en"): SpeechSynthesisVoice | null => {
        const st = stateRef.current
        const primary = lang === "en" ? st.selectedEn : st.selectedKo
        const fallback = lang === "en" ? st.selectedKo : st.selectedEn
        const pick = (val: string) => (val !== "" ? st.voices[parseInt(val, 10)] || null : null)
        return pick(primary) || pick(fallback) || null
    }, [])

    // 문장을 하나씩 이어서 읽는다. 문장마다 언어를 감지해 해당 목소리를 사용한다.
    const speakIndex = useCallback(
        (idx: number, myGen: number) => {
            if (myGen !== genRef.current) return // 무효화된 세션이면 중단
            const sen = stateRef.current.sentences
            if (idx >= sen.length) {
                // 전체 완료
                setIsPlaying(false)
                setIsPaused(false)
                setActiveIdx(sen.length)
                setStatus("완료")
                return
            }
            const s = sen[idx]
            setActiveIdx(idx)

            const utter = new SpeechSynthesisUtterance(s.text)
            const voice = voiceForLang(s.lang)
            if (voice) {
                utter.voice = voice
                utter.lang = voice.lang
            } else {
                utter.lang = s.lang === "en" ? "en-US" : "ko-KR"
            }
            utter.rate = stateRef.current.rate
            utter.pitch = stateRef.current.pitch

            utter.onend = () => {
                if (myGen === genRef.current) speakIndex(idx + 1, myGen)
            }
            utter.onerror = (e) => {
                if (myGen !== genRef.current || e.error === "interrupted" || e.error === "canceled") return
                // 한 문장에서 오류가 나도 다음 문장으로 계속 진행한다.
                speakIndex(idx + 1, myGen)
            }
            window.speechSynthesis.speak(utter)
        },
        [voiceForLang]
    )

    const speakFrom = useCallback(
        (fromIdx: number) => {
            genRef.current++
            const myGen = genRef.current
            window.speechSynthesis.cancel()
            setIsPlaying(true)
            setIsPaused(false)
            setStatus("재생 중...")
            speakIndex(fromIdx, myGen)
        },
        [speakIndex]
    )

    const handlePlay = () => {
        const synth = window.speechSynthesis
        // 일시정지 상태면 이어서 재생
        if (synth.paused && synth.speaking) {
            synth.resume()
            setIsPaused(false)
            setIsPlaying(true)
            setStatus("재생 중...")
            return
        }
        const t = text.trim()
        if (!t) {
            setStatus("읽을 텍스트를 입력하세요.")
            return
        }
        const sen = buildSentences(t)
        setFullText(t)
        setSentences(sen)
        stateRef.current.sentences = sen // 즉시 재생에 반영
        setActiveIdx(-1)
        setShowReader(true)
        speakFrom(0)
    }

    const handlePause = () => {
        const synth = window.speechSynthesis
        if (synth.speaking && !synth.paused) {
            synth.pause()
            setIsPaused(true)
            setStatus("일시정지됨")
        }
    }

    const handleStop = () => {
        genRef.current++ // 진행 중 콜백 무효화
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        setIsPaused(false)
        setStatus("정지됨")
        setActiveIdx(-1)
        setShowReader(false)
    }

    const total = sentences.length
    const current = Math.min(activeIdx + 1, total)
    const progress = total ? (current / total) * 100 : 0

    // 리더 뷰: 문장별 span을 렌더링하며 원본 공백/줄바꿈을 보존한다.
    const readerNodes = useMemo(() => {
        const nodes: React.ReactNode[] = []
        let cursor = 0
        sentences.forEach((s, i) => {
            if (s.start > cursor) {
                nodes.push(<React.Fragment key={`t${i}`}>{fullText.slice(cursor, s.start)}</React.Fragment>)
            }
            const isActive = i === activeIdx
            const isDone = i < activeIdx
            nodes.push(
                <span
                    key={`s${i}`}
                    ref={isActive ? activeSpanRef : undefined}
                    onClick={() => speakFrom(i)}
                    title={s.lang === "en" ? "영어" : "한국어"}
                    style={{
                        borderRadius: "4px",
                        padding: "1px 2px",
                        cursor: "pointer",
                        transition: "background 0.15s, color 0.15s",
                        ...(isActive
                            ? {
                                  background: "var(--ifm-color-primary-lightest)",
                                  boxShadow: "0 0 0 2px var(--ifm-color-primary)",
                              }
                            : {}),
                        ...(isDone ? { color: "var(--ifm-color-emphasis-500)" } : {}),
                    }}
                >
                    {fullText.slice(s.start, s.end)}
                </span>
            )
            cursor = s.end
        })
        if (cursor < fullText.length) {
            nodes.push(<React.Fragment key="tail">{fullText.slice(cursor)}</React.Fragment>)
        }
        return nodes
    }, [sentences, activeIdx, fullText, speakFrom])

    const renderVoiceOptions = (list: VoiceEntry[]) =>
        list.length ? (
            list.map((e) => (
                <SelectItem key={e.idx} value={String(e.idx)}>
                    {`${isPremium(e.voice) ? "⭐ " : ""}${e.voice.name} (${e.voice.lang})`}
                </SelectItem>
            ))
        ) : (
            <SelectItem value="none" disabled>
                (사용 가능한 목소리 없음)
            </SelectItem>
        )

    return (
        <ToolLayout
            title="TTS Reader"
            description="텍스트를 붙여넣고 목소리를 골라 들어보세요"
            icon={<Volume2 className="h-8 w-8 text-primary" />}
            maxWidth="max-w-4xl"
        >
            <Card>
                <CardContent className="pt-6">
                    {!supported && (
                        <p className="text-sm text-red-600 mb-4">이 브라우저는 음성 합성을 지원하지 않습니다.</p>
                    )}

                    {!showReader ? (
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="여기에 읽을 텍스트를 붙여넣으세요..."
                            className="min-h-[200px] text-[15px] leading-relaxed"
                        />
                    ) : (
                        <div
                            style={{
                                minHeight: "200px",
                                maxHeight: "340px",
                                overflowY: "auto",
                                border: "1px solid var(--ifm-color-emphasis-200)",
                                borderRadius: "10px",
                                padding: "14px",
                                fontSize: "15px",
                                lineHeight: 1.9,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {readerNodes}
                        </div>
                    )}

                    {/* 컨트롤 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                        <div className="flex flex-col gap-1.5">
                            <Label>🇰🇷 한국어 목소리</Label>
                            <Select value={selectedKo} onValueChange={setSelectedKo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="목소리 선택" />
                                </SelectTrigger>
                                <SelectContent>{renderVoiceOptions(koVoices)}</SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>🇺🇸 영어 목소리</Label>
                            <Select value={selectedEn} onValueChange={setSelectedEn}>
                                <SelectTrigger>
                                    <SelectValue placeholder="목소리 선택" />
                                </SelectTrigger>
                                <SelectContent>{renderVoiceOptions(enVoices)}</SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>
                                속도 <span className="font-semibold text-foreground">{rate.toFixed(1)}</span>
                            </Label>
                            <input
                                type="range"
                                min={0.5}
                                max={2}
                                step={0.1}
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                style={{ width: "100%", accentColor: "var(--ifm-color-primary)" }}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>
                                음높이 <span className="font-semibold text-foreground">{pitch.toFixed(1)}</span>
                            </Label>
                            <input
                                type="range"
                                min={0}
                                max={2}
                                step={0.1}
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                                style={{ width: "100%", accentColor: "var(--ifm-color-primary)" }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3">
                        ⭐ = 프리미엄(자연스러운) 목소리 · 문장마다 언어를 자동 감지해 해당 목소리로 읽습니다.
                    </p>

                    {/* 버튼 */}
                    <div className="flex flex-wrap gap-2.5 mt-5">
                        <Button onClick={handlePlay} disabled={!supported || (isPlaying && !isPaused)} className="gap-2">
                            <Play className="w-4 h-4" />
                            {isPaused ? "이어서" : "재생"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handlePause}
                            disabled={!isPlaying || isPaused}
                            className="gap-2"
                        >
                            <Pause className="w-4 h-4" />
                            일시정지
                        </Button>
                        <Button variant="secondary" onClick={handleStop} disabled={!isPlaying} className="gap-2">
                            <Square className="w-4 h-4" />
                            정지
                        </Button>
                    </div>

                    {/* 진행률 */}
                    {showReader && (
                        <div className="flex items-center gap-2.5 mt-5">
                            <div
                                style={{
                                    flex: 1,
                                    height: "8px",
                                    background: "var(--ifm-color-emphasis-200)",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${progress}%`,
                                        background: "var(--ifm-color-primary)",
                                        borderRadius: "999px",
                                        transition: "width 0.25s ease",
                                    }}
                                />
                            </div>
                            <span
                                className="text-xs text-muted-foreground text-right"
                                style={{ fontVariantNumeric: "tabular-nums", minWidth: "56px" }}
                            >
                                {current} / {total}
                            </span>
                        </div>
                    )}

                    {status && <p className="text-sm text-muted-foreground mt-3.5 min-h-[18px]">{status}</p>}
                </CardContent>
            </Card>
        </ToolLayout>
    )
}
