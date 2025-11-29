import jsQR from 'jsqr';
import { CameraManager } from './camera';

export class QRScanner {
    cameraManager: CameraManager;
    isScanning: boolean = false;
    onResultCallback: ((text: string) => void) | null = null;

    constructor(cameraManager: CameraManager) {
        this.cameraManager = cameraManager;
    }

    start() {
        this.isScanning = true;
        this.scanLoop();
    }

    stop() {
        this.isScanning = false;
    }

    onResult(callback: (text: string) => void) {
        this.onResultCallback = callback;
    }

    private scanLoop() {
        if (!this.isScanning) return;

        const cameraAccess = this.cameraManager.getCameraFrame();
        if (cameraAccess && cameraAccess.onFrame) {
            // Hypothetical API usage based on prompt
            cameraAccess.onFrame((frameData: any) => {
                if (!this.isScanning) return;

                // Assuming frameData contains width, height, and data (Uint8ClampedArray)
                // You might need to convert the texture or buffer here depending on SDK specifics
                const { width, height, data } = frameData;

                if (data && width && height) {
                    const code = jsQR(data, width, height);
                    if (code) {
                        console.log('QR Code found:', code.data);
                        if (this.onResultCallback) {
                            this.onResultCallback(code.data);
                        }
                    }
                }
            });
        }

        requestAnimationFrame(this.scanLoop.bind(this));
    }
}
