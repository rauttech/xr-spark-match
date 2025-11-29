export const passthrough = {
    createLayer: async () => {
        console.log('Mock Passthrough Layer Created');
        return { destroy: () => console.log('Mock Passthrough Layer Destroyed') };
    }
};

export const camera = {
    getCameraAccess: async (config: any) => {
        console.log('Mock Camera Access Granted', config);
        return {
            onFrame: (callback: any) => {
                // Simulate a frame every 1 second
                setInterval(() => {
                    callback({ width: 100, height: 100, data: new Uint8ClampedArray(40000) });
                }, 1000);
            }
        };
    }
};
