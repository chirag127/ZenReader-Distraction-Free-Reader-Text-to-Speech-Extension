import { useState, useEffect, useRef, useCallback } from "react";

interface UseTTSProps {
  text: string;
  enabled: boolean;
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  onStateChange?: (isSpeaking: boolean) => void;
  onBoundary?: (charIndex: number, charLength: number) => void;
}

export function useTTS({
  text,
  enabled,
  rate = 1.0,
  pitch = 1.0,
  voiceURI,
  onStateChange,
  onBoundary,
}: UseTTSProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up text for better speech
  const prepareText = useCallback((rawText: string) => {
    // Basic cleanup, can be expanded
    return rawText.replace(/\s+/g, " ").trim();
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    onStateChange?.(false);
  }, [onStateChange]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const speak = useCallback(() => {
    stop(); // Ensure clear state

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(prepareText(text));
    utteranceRef.current = utterance;

    utterance.rate = rate;
    utterance.pitch = pitch;

    if (voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.voiceURI === voiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStateChange?.(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      onStateChange?.(false);
    };

    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
      onStateChange?.(false);
    };

    // Boundary event for highlighting
    utterance.onboundary = (event) => {
      if (event.name === "word" && onBoundary) {
        // charIndex is the index in the *utterance text*, which might differ slightly
        // from the original DOM text if we did aggressive cleaning.
        // For now, we assume 1:1 mapping or simple cleaning.
        onBoundary(event.charIndex, event.charLength || 0);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [text, rate, pitch, voiceURI, onStateChange, onBoundary, prepareText, stop]);

  // Handle play/pause toggle
  const toggle = useCallback(() => {
    if (isSpeaking) {
      if (isPaused) resume();
      else pause();
    } else {
      speak();
    }
  }, [isSpeaking, isPaused, speak, pause, resume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update dynamic properties while speaking
  useEffect(() => {
    if (utteranceRef.current && isSpeaking && !isPaused) {
      // Note: Changing rate/pitch mid-speech is not supported by all browsers
      // without restarting the utterance.
      // For robustness, we usually restart if these change, or just let it apply next time.
      // We'll leave it for now to avoid chopping audio.
    }
  }, [rate, pitch]);

  return {
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
    toggle,
  };
}
