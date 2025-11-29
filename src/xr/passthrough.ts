export class PassthroughManager {
    constructor() { }

    async enablePassthrough() {
        console.log('Passthrough is handled by WebXR session (immersive-ar). Ensure background is transparent.');
    }

    disablePassthrough() {
        // No-op for basic passthrough
    }
}
