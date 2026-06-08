import { useEffect, useMemo, useState } from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export default function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [timer, setTimer] = useState(0)

  const recognition = useMemo(() => {
    if (!SpeechRecognition) return null

    const recognitionInstance = new SpeechRecognition()
    recognitionInstance.continuous = true
    recognitionInstance.interimResults = true
    recognitionInstance.lang = 'en-US'

    recognitionInstance.onresult = event => {
      const results = Array.from(event.results)
      const latest = results.map(result => result[0].transcript).join(' ')
      setTranscript(latest)
    }

    recognitionInstance.onend = () => {
      setListening(false)
    }

    recognitionInstance.onerror = () => {
      setListening(false)
    }

    return recognitionInstance
  }, [])

  useEffect(() => {
    let interval
    if (listening) {
      interval = window.setInterval(() => {
        setTimer(value => value + 1)
      }, 1000)
    }
    return () => window.clearInterval(interval)
  }, [listening])

  const start = () => {
    if (!recognition) return
    setTranscript('')
    setTimer(0)
    recognition.start()
    setListening(true)
  }

  const stop = () => {
    if (!recognition) return
    recognition.stop()
    setListening(false)
  }

  const reset = () => {
    setTranscript('')
    setTimer(0)
    setListening(false)
    recognition?.stop()
  }

  return {
    supported: Boolean(recognition),
    listening,
    transcript,
    timer,
    start,
    stop,
    reset
  }
}
