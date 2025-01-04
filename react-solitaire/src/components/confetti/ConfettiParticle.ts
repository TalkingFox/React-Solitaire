export interface CanvasSettings {
    height: number,
    width: number,
    context: CanvasRenderingContext2D,
    confettiLimit: number
}

export class ConfettiParticle {
    public x: number;
    public y: number;

    public readonly radius: number;
    public readonly d: number;

    public readonly color: string;

    public tilt: number;

    public readonly tiltAngleIncrement: number;
    public tiltAngle: number;

    public readonly canvasSettings: CanvasSettings;

    public readonly particles: ConfettiParticle[] = [];

    private static confettiColors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
    ];

    constructor(canvasSettings: CanvasSettings) {
        this.canvasSettings = canvasSettings;
        this.x = Math.random() * canvasSettings.width;
        this.y = (Math.random() * canvasSettings.height) - canvasSettings.height;
        this.radius = this.randomRange(11, 33);
        this.d = Math.random() * canvasSettings.confettiLimit + 11;
        this.color = ConfettiParticle.confettiColors[this.randomRange(0, ConfettiParticle.confettiColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncrement = (Math.random() * 0.07) + 0.05;
        this.tiltAngle = 0;

    }

    private randomRange(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    public Draw() {
        const context = this.canvasSettings.context;
        context.beginPath();
        context.lineWidth = this.radius / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.radius / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.radius / 5);
        context.stroke();
    }
}