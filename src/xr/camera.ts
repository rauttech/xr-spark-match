import * as IWSdk from '@iwsdk/core';

export class CameraManager {
    cameraAccess: any;

    constructor() { }

    async requestCameraAccess() {
        try {
            console.log('Requesting camera access...');
            // @ts-ignore
            this.cameraAccess = await IWSdk.camera.getCameraAccess({
                format: 'rgba',
                depth: false,
            });
            console.log('Camera access granted');
            return true;
        } catch (e) {
            console.error('Failed to get camera access. Ensure "Browser Camera Access" is enabled in Quest settings.', e);
            return false;
        }
    }

    getCameraFrame() {
        if (!this.cameraAccess) return null;
        // This is a placeholder for the actual API call to get the frame
        // The SDK documentation would specify the exact method, e.g., onFrame or getFrame
        return this.cameraAccess;
    }
}
