import React, { useState, useEffect } from "react";
import { useTTS } from "@/hooks/useTTS";
import { type ReaderSettings, updateSettings, settingsStorage } from "@/utils/storage";
import { Speaker, Play, Pause, Square, Settings as SettingsIcon } from "lucide-react";

interface ReaderControlsProps {
  contentRef: React.RefObject<HTMLDivElement>;
  fullText: string;
}

export function ReaderControls({ contentRef, fullText }: ReaderControlsProps) {
  const [settings, setSettings] = useState<ReaderSettings | null>(null);

  useEffect(() => {
    settingsStorage.getValue().then(setSettings);

    // Subscribe to changes
    const unwatch = settingsStorage.watch((newSettings) => {
      setSettings(newSettings);
    });
    return () => unwatch();
  }, []);

  const handleBoundary = (charIndex: number, length: number) => {
    // This is a simplified highlighting strategy.
    // Real implementation needs to map charIndex back to DOM nodes.
    // For this MVP step, we will just log it or implement a basic text selection.
    // A full "Highlight in DOM" implementation requires a TreeWalker as seen in the legacy code.
    // We will implement that in a separate helper if needed, but for now let's ensure TTS works.
  };

  const { isSpeaking, isPaused, toggle, stop } = useTTS({
    text: fullText,
    enabled: true,
    rate: settings?.speechRate || 1.0,
    pitch: settings?.speechPitch || 1.0,
    voiceURI: settings?.voiceURI,
    onBoundary: handleBoundary,
  });

  if (!settings) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-6 py-3 flex items-center gap-4 border border-gray-200 dark:border-gray-700 z-50">
      <button
        onClick={toggle}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={isSpeaking && !isPaused ? "Pause" : "Read Aloud"}
      >
        {isSpeaking && !isPaused ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {isSpeaking && (
        <button
          onClick={stop}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
          title="Stop"
        >
          <Square size={18} />
        </button>
      )}

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Speed</span>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={settings.speechRate}
          onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
          className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs w-8">{settings.speechRate}x</span>
      </div>
    </div>
  );
}
