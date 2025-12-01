// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTTS } from "../hooks/useTTS";

// Setup Mock Window for SpeechSynthesis
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockPause = vi.fn();
const mockResume = vi.fn();
const mockGetVoices = vi.fn(() => []);

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  pause: mockPause,
  resume: mockResume,
  getVoices: mockGetVoices,
  paused: false,
  speaking: false,
  onvoiceschanged: null,
};

// Use stubGlobal to inject into the test environment
vi.stubGlobal("speechSynthesis", mockSpeechSynthesis);

// We don't need to stub window fully if we use happy-dom,
// but we do need to ensure specific properties exist if they are missing.
// happy-dom usually provides a good window object.

class MockSpeechSynthesisUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  voice = null;
  onstart = () => {};
  onend = () => {};
  onerror = () => {};
  onboundary = () => {};

  constructor(text: string) {
    this.text = text;
  }
}

vi.stubGlobal("SpeechSynthesisUtterance", MockSpeechSynthesisUtterance);

describe("useTTS Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSpeechSynthesis.paused = false;
    mockSpeechSynthesis.speaking = false;
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTTS({ text: "Hello", enabled: true }));
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it("should start speaking when speak is called", () => {
    const { result } = renderHook(() => useTTS({ text: "Hello", enabled: true }));

    act(() => {
      result.current.speak();
    });

    expect(mockCancel).toHaveBeenCalled(); // Should cancel previous
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("should stop speaking", () => {
    const { result } = renderHook(() => useTTS({ text: "Hello", enabled: true }));

    act(() => {
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });
});
