// QRScanner component – uses WebXR camera feed to scan QR codes
import jsQR from 'jsqr';

export class QRScanner {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private onScanned: (data: string) => void;
    private scanning: boolean = false;

    constructor(onScanned: (data: string) => void) {
        this.onScanned = onScanned;
        this.video = document.createElement('video');
        this.video.setAttribute('autoplay', 'true');
        this.video.setAttribute('playsinline', 'true');
        this.canvas = document.createElement('canvas');
        const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas 2D context not available');
        this.ctx = ctx;
        this.startCamera();
    }

    private async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            this.video.srcObject = stream;
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.scanning = true;
                requestAnimationFrame(this.tick.bind(this));
            });
        } catch (e) {
            console.error('QRScanner: camera access denied', e);
        }
    }

    private tick() {
        if (!this.scanning) return;

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                // Found a QR code
                this.onScanned(code.data);
                // Optional: Stop scanning or debounce? 
                // For now, we keep scanning but the consumer should handle debouncing if needed.
            }
        }
        requestAnimationFrame(this.tick.bind(this));
    }

    public stop() {
        this.scanning = false;
        if (this.video.srcObject) {
            const stream = this.video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
}
