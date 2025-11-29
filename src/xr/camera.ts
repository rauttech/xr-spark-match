export class CameraManager {
    video: HTMLVideoElement | null = null;
    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;

    constructor() { }

    async requestCameraAccess() {
        try {
            console.log('Requesting camera access via getUserMedia...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.video = document.createElement('video');
            this.video.srcObject = stream;
            this.video.setAttribute('playsinline', '');
            this.video.muted = true;
            await this.video.play();

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

            console.log('Camera access granted and video playing');
            return true;
        } catch (e) {
            console.error('Failed to get camera access. Ensure "Browser Camera Access" is enabled in Quest settings.', e);
            return false;
        }
    }

    getCameraFrame() {
        if (!this.video || !this.ctx || !this.canvas) return null;

        // Draw video frame to canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Return data compatible with QRScanner
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return {
            onFrame: (callback: any) => {
                callback({
                    width: imageData.width,
                    height: imageData.height,
                    data: imageData.data
                });
            }
        };
    }
}
