import { useEffect, useRef, useState } from 'react'

export default function useAudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [levels, setLevels] = useState(Array(16).fill(0))
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const stopPromiseRef = useRef(null)

  useEffect(() => {
    let interval
    if (recording) {
      interval = window.setInterval(() => setTimer((value) => value + 1), 1000)
    }
    return () => window.clearInterval(interval)
  }, [recording])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const updateLevels = () => {
    if (!analyserRef.current) return
    const data = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(data)
    const values = Array.from(data).slice(0, 16).map((value) => value / 255)
    setLevels(values)
    rafRef.current = window.requestAnimationFrame(updateLevels)
  }

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 64
    source.connect(analyser)
    analyserRef.current = analyser

    const recorder = new MediaRecorder(stream)
    const chunks = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setAudioBlob(blob)
      setAudioUrl(URL.createObjectURL(blob))
      if (stopPromiseRef.current) {
        stopPromiseRef.current(blob)
        stopPromiseRef.current = null
      }
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setRecording(true)
    setTimer(0)
    rafRef.current = window.requestAnimationFrame(updateLevels)
  }

  const stop = () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null)
        return
      }

      stopPromiseRef.current = resolve
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      analyserRef.current = null
      streamRef.current = null
      mediaRecorderRef.current = null
      setRecording(false)
      window.cancelAnimationFrame(rafRef.current)
    })
  }

  const reset = () => {
    stop()
    setAudioBlob(null)
    setAudioUrl(null)
    setTimer(0)
    setLevels(Array(16).fill(0))
  }

  return {
    recording,
    supported: Boolean(navigator.mediaDevices && window.MediaRecorder),
    timer,
    audioBlob,
    audioUrl,
    levels,
    start,
    stop,
    reset,
  }
}
