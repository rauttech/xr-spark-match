declare module '@metadev/immersive-web-sdk' {
    export namespace passthrough {
        function createLayer(): Promise<any>;
    }
    export namespace camera {
        function getCameraAccess(config: { format: string; depth: boolean }): Promise<any>;
    }
}

declare module '@iwsdk/core' {
    export namespace passthrough {
        function createLayer(): Promise<any>;
    }
    export namespace camera {
        function getCameraAccess(config: { format: string; depth: boolean }): Promise<any>;
    }
}
