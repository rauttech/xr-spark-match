import * as IWSdk from '@iwsdk/core';

export class PassthroughManager {
    passthroughLayer: any;

    constructor() { }

    async enablePassthrough() {
        try {
            // Create a passthrough layer using the Immersive Web SDK
            this.passthroughLayer = await IWSdk.passthrough.createLayer();
            console.log('Passthrough layer created');
        } catch (e) {
            console.error('Failed to create passthrough layer:', e);
        }
    }

    disablePassthrough() {
        if (this.passthroughLayer) {
            this.passthroughLayer.destroy();
            this.passthroughLayer = null;
        }
    }
}
