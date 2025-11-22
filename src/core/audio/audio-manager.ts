import * as THREE from 'three';

export class AudioManager {
    private listener: THREE.AudioListener;
    private audioLoader: THREE.AudioLoader;
    private soundEnabled: boolean = false;

    constructor(camera: THREE.Camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.soundEnabled = true;
    }

    // Generate a simple beep sound buffer procedurally to avoid external assets for MVP
    private createBeepBuffer(frequency: number = 440, duration: number = 0.1): AudioBuffer {
        const ctx = this.listener.context;
        const sampleRate = ctx.sampleRate;
        const length = duration * sampleRate;
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            // Simple sine wave
            data[i] = Math.sin(i * (2 * Math.PI * frequency) / sampleRate);
            // Apply envelope to avoid clicking
            if (i < 100) data[i] *= i / 100;
            if (i > length - 100) data[i] *= (length - i) / 100;
        }
        return buffer;
    }

    playSparkSound(position: THREE.Vector3) {
        if (!this.soundEnabled) return;
        const sound = new THREE.PositionalAudio(this.listener);
        sound.setBuffer(this.createBeepBuffer(880, 0.2)); // High pitch for spark
        sound.setRefDistance(1);
        sound.position.copy(position);
        sound.play();
    }

    playMatchSound() {
        if (!this.soundEnabled) return;
        const sound = new THREE.Audio(this.listener);
        sound.setBuffer(this.createBeepBuffer(600, 0.3)); // Medium pitch for match
        sound.setVolume(0.5);
        sound.play();
    }

    playHoverSound(position: THREE.Vector3) {
        if (!this.soundEnabled) return;
        const sound = new THREE.PositionalAudio(this.listener);
        sound.setBuffer(this.createBeepBuffer(300, 0.05)); // Low short blip for hover
        sound.setRefDistance(0.5);
        sound.setVolume(0.3);
        sound.position.copy(position);
        sound.play();
    }
}
