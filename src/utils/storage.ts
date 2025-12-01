import { storage } from "wxt/storage";
import type { WxtStorageItem } from "wxt/storage";

export interface ReaderSettings {
  theme: "light" | "dark";
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  speechRate: number;
  speechPitch: number;
  voiceURI: string;
  geminiApiKey: string;
}

export const defaultSettings: ReaderSettings = {
  theme: "light",
  fontFamily: "Georgia, serif",
  fontSize: 18,
  lineHeight: 1.5,
  speechRate: 1.0,
  speechPitch: 1.0,
  voiceURI: "",
  geminiApiKey: "",
};

export const settingsStorage = storage.defineItem<ReaderSettings>("local:settings", {
  defaultValue: defaultSettings,
});

// Helper to update specific fields
export async function updateSettings(updates: Partial<ReaderSettings>) {
  const current = await settingsStorage.getValue();
  await settingsStorage.setValue({ ...current, ...updates });
}
