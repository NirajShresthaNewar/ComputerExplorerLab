import { useCallback, useRef } from 'react'

// Generates short synth tones with the Web Audio API so no external sound
// files are needed. Keeps the app fully offline-capable.
function playTone(ctx, { freq, duration, type = 'sine', gain = 0.15 }) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gainNode.gain.value = gain
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function useSoundEffects(enabled) {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      ctxRef.current = new AudioCtx()
    }
    return ctxRef.current
  }, [])

  const playClick = useCallback(() => {
    if (!enabled) return
    playTone(getCtx(), { freq: 440, duration: 0.08, type: 'square', gain: 0.06 })
  }, [enabled, getCtx])

  const playCorrect = useCallback(() => {
    if (!enabled) return
    const ctx = getCtx()
    playTone(ctx, { freq: 523.25, duration: 0.15, gain: 0.1 })
    setTimeout(() => playTone(ctx, { freq: 659.25, duration: 0.2, gain: 0.1 }), 100)
  }, [enabled, getCtx])

  const playWrong = useCallback(() => {
    if (!enabled) return
    playTone(getCtx(), { freq: 180, duration: 0.25, type: 'sawtooth', gain: 0.08 })
  }, [enabled, getCtx])

  const playAchievement = useCallback(() => {
    if (!enabled) return
    const ctx = getCtx()
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => playTone(ctx, { freq, duration: 0.25, gain: 0.09 }), i * 120)
    })
  }, [enabled, getCtx])

  return { playClick, playCorrect, playWrong, playAchievement }
}
