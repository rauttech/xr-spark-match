export class StatsMonitor {
    private fpsElement: HTMLElement;
    private frameCount: number = 0;
    private lastTime: number = performance.now();

    constructor() {
        this.fpsElement = document.createElement("div");
        this.fpsElement.style.position = "absolute";
        this.fpsElement.style.top = "10px";
        this.fpsElement.style.left = "10px";
        this.fpsElement.style.color = "lime";
        this.fpsElement.style.fontFamily = "monospace";
        this.fpsElement.style.zIndex = "999";
        document.body.appendChild(this.fpsElement);
    }

    update() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastTime >= 1000) {
            this.fpsElement.innerText = `FPS: ${this.frameCount}`;
            this.frameCount = 0;
            this.lastTime = now;
        }
    }
}
