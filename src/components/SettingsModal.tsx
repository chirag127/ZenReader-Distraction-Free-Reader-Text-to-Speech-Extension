import React, { useEffect, useState } from "react";
import { updateSettings, settingsStorage, type ReaderSettings } from "@/utils/storage";
import { X, Save, Moon, Sun, Type } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<ReaderSettings | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    settingsStorage.getValue().then(setSettings);

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  if (!isOpen || !settings) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 dark:text-white">Settings</h2>

        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Appearance
            </h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => updateSettings({ theme: "light" })}
                className={`flex-1 py-2 rounded border flex items-center justify-center gap-2 ${settings.theme === "light" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200"}`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => updateSettings({ theme: "dark" })}
                className={`flex-1 py-2 rounded border flex items-center justify-center gap-2 ${settings.theme === "dark" ? "border-blue-500 bg-blue-900/20 text-blue-400" : "border-gray-200"}`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm dark:text-gray-300">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="Arial, sans-serif">Arial (Sans)</option>
                <option value="'Courier New', monospace">Courier (Mono)</option>
                <option value="system-ui, sans-serif">System UI</option>
              </select>
            </div>
          </div>

          {/* AI Configuration */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Intelligence
            </h3>
            <div className="space-y-2">
              <label className="block text-sm dark:text-gray-300">Gemini API Key</label>
              <input
                type="password"
                value={settings.geminiApiKey}
                onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
                placeholder="Paste your Google AI Studio Key"
                className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500">
                Required for AI extraction. Stored locally in your browser.
              </p>
            </div>
          </div>

          {/* Voice Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Speech
            </h3>
            <div className="space-y-2">
              <label className="block text-sm dark:text-gray-300">Preferred Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => updateSettings({ voiceURI: e.target.value })}
                className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Save size={16} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
