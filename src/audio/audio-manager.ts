export class AudioManager {
    private static instance: AudioManager | null = null;
    private audioContext: AudioContext;
    private buffers: Map<string, AudioBuffer> = new Map();

    private constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    async load(name: string, url: string): Promise<void> {
        if (this.buffers.has(name)) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers.set(name, audioBuffer);
        } catch (e) {
            console.warn(`AudioManager: Failed to load sound "${name}" from ${url}. Using fallback.`);
            this.generateFallbackSound(name);
        }
    }

    private generateFallbackSound(name: string) {
        // Create a simple beep for fallback
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.1;
        const frameCount = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            // Simple sine wave
            data[i] = Math.sin(i * 2 * Math.PI * 440 / sampleRate);
        }
        this.buffers.set(name, buffer);
    }

    play(name: string): void {
        const buffer = this.buffers.get(name);
        if (!buffer) {
            console.warn(`AudioManager: buffer "${name}" not loaded`);
            return;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    // Convenience methods
    playMatchSound() { this.play('spark'); }
    playHoverSound() { this.play('hover'); }
    playSwipeSound() { this.play('swipe'); } // Ensure 'swipe' is loaded or falls back
}
