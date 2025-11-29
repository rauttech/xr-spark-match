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
            console.warn(`AudioManager: Failed to load sound "${name}" from ${url}.`);
        }
    }

    // Dynamic synthesis instead of static buffers for better control
    playNote(frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Envelope to avoid clicks
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration); // Decay

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }

    playMatchSound() {
        // Harmonious chord (C Major)
        this.playNote(523.25, 'sine', 0.4, 0.1); // C5
        setTimeout(() => this.playNote(659.25, 'sine', 0.4, 0.1), 50); // E5
        setTimeout(() => this.playNote(783.99, 'sine', 0.6, 0.1), 100); // G5
    }

    playHoverSound() {
        // Subtle, low-pitch "pop" or "tick"
        this.playNote(300, 'triangle', 0.05, 0.05);
    }

    playSwipeSound() {
        // Whoosh effect (simulated with slide)
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);

        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    }

    // Deprecated but kept for compatibility if needed
    play(name: string) {
        if (name === 'spark') this.playMatchSound();
        else if (name === 'hover') this.playHoverSound();
        else if (name === 'swipe') this.playSwipeSound();
    }
}
