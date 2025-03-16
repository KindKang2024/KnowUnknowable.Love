interface BaseOptions {
    canvasSize?: number;    // canvas size
}

interface HeartOptions extends BaseOptions {
    size?: number;          // heart size
    color?: string;         // main color
    glowColor?: string;     // glow color
    glowStrength?: number;  // glow strength (0-1)
    strokeWidth?: number;   // stroke width
}

interface DotOptions extends BaseOptions {
    color?: string;         // main color
    fadeStart?: number;     // fade start position (0-1)
    fadeEnd?: number;       // fade end position (0-1)
    opacity?: number;       // maximum opacity (0-1)
}

interface StarOptions extends BaseOptions {
    points?: number;        // number of star points
    innerRadius?: number;   // inner radius
    outerRadius?: number;   // outer radius
    color?: string;         // main color
    glowColor?: string;     // glow color
    glowStrength?: number;  // glow strength (0-1)
    rotation?: number;      // rotation angle
}

const defaultHeartOptions: HeartOptions = {
    size: 10,
    color: '#ffffff',
    glowColor: '#ff6b6b',
    glowStrength: 0.8,
    strokeWidth: 1,
    canvasSize: 32
};

const defaultDotOptions: DotOptions = {
    color: '#ffffff',
    fadeStart: 0.3,
    fadeEnd: 1,
    opacity: 1,
    canvasSize: 32
};

const defaultStarOptions: StarOptions = {
    points: 5,
    innerRadius: 5,
    outerRadius: 10,
    color: '#ffffff',
    glowColor: '#ffff00',
    glowStrength: 0.8,
    rotation: 0,
    canvasSize: 32
};

export class ParticleCanvasTextureFactory {
    static createHeart(options: HeartOptions = {}) {
        const opts = { ...defaultHeartOptions, ...options };
        const canvas = document.createElement('canvas');
        canvas.width = opts.canvasSize!;
        canvas.height = opts.canvasSize!;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 创建发光渐变
        const glowGradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, opts.size! * 1.5
        );
        glowGradient.addColorStop(0, `${opts.glowColor}ff`);
        glowGradient.addColorStop(0.5, `${opts.glowColor}88`);
        glowGradient.addColorStop(1, `${opts.glowColor}00`);

        ctx.shadowColor = opts.glowColor!;
        ctx.shadowBlur = opts.size! * opts.glowStrength!;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = opts.color!;
        ctx.strokeStyle = opts.color!;
        ctx.lineWidth = opts.strokeWidth!;

        ctx.beginPath();
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const size = opts.size!;

        ctx.moveTo(x, y + size * 0.5);
        ctx.bezierCurveTo(
            x - size, y,
            x - size, y - size,
            x, y - size
        );
        ctx.bezierCurveTo(
            x + size, y - size,
            x + size, y,
            x, y + size * 0.5
        );

        ctx.fill();
        ctx.stroke();

        return canvas;
    }

    static createLove(options: HeartOptions = {}) {
        const opts = { ...defaultHeartOptions, ...options };
        const canvas = document.createElement('canvas');
        canvas.width = opts.canvasSize!;
        canvas.height = opts.canvasSize!;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Setup glow effect
        ctx.shadowColor = opts.glowColor!;
        ctx.shadowBlur = opts.size! * opts.glowStrength!;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const width = opts.size! * 2;
        const height = opts.size! * 2;
        const topCurveHeight = height * 0.3;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - height / 3 + topCurveHeight);

        // top left curve
        ctx.bezierCurveTo(
            centerX, centerY - height / 3,
            centerX - width / 2, centerY - height / 3,
            centerX - width / 2, centerY - height / 3 + topCurveHeight
        );

        // bottom left curve
        ctx.bezierCurveTo(
            centerX - width / 2, centerY - height / 3 + (height + topCurveHeight) / 2,
            centerX, centerY - height / 3 + (height + topCurveHeight) / 2,
            centerX, centerY - height / 3 + height
        );

        // bottom right curve
        ctx.bezierCurveTo(
            centerX, centerY - height / 3 + (height + topCurveHeight) / 2,
            centerX + width / 2, centerY - height / 3 + (height + topCurveHeight) / 2,
            centerX + width / 2, centerY - height / 3 + topCurveHeight
        );

        // top right curve
        ctx.bezierCurveTo(
            centerX + width / 2, centerY - height / 3,
            centerX, centerY - height / 3,
            centerX, centerY - height / 3 + topCurveHeight
        );

        ctx.closePath();
        ctx.fillStyle = opts.color!;
        ctx.fill();

        if (opts.strokeWidth! > 0) {
            ctx.strokeStyle = opts.color!;
            ctx.lineWidth = opts.strokeWidth!;
            ctx.stroke();
        }

        ctx.restore();

        return canvas;
    }

    static createDot(options: DotOptions = {}) {
        const opts = { ...defaultDotOptions, ...options };
        const canvas = document.createElement('canvas');
        canvas.width = opts.canvasSize!;
        canvas.height = opts.canvasSize!;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createRadialGradient(
            opts.canvasSize! / 2, opts.canvasSize! / 2, 0,
            opts.canvasSize! / 2, opts.canvasSize! / 2, opts.canvasSize! / 2
        );

        gradient.addColorStop(0, `${opts.color}${Math.round(opts.opacity! * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(opts.fadeStart!, `${opts.color}${Math.round(opts.opacity! * 0.7 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(opts.fadeEnd!, `${opts.color}00`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, opts.canvasSize!, opts.canvasSize!);

        return canvas;
    }

    static createStar(options: StarOptions = {}) {
        const opts = { ...defaultStarOptions, ...options };
        const canvas = document.createElement('canvas');
        canvas.width = opts.canvasSize!;
        canvas.height = opts.canvasSize!;
        const ctx = canvas.getContext('2d')!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = opts.glowColor!;
        ctx.shadowBlur = opts.outerRadius! * opts.glowStrength!;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = opts.color!;
        ctx.strokeStyle = opts.color!;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.PI * 2 / opts.points!;
        const rotation = opts.rotation! * Math.PI / 180;

        ctx.beginPath();
        ctx.moveTo(centerX + opts.outerRadius! * Math.cos(rotation),
            centerY + opts.outerRadius! * Math.sin(rotation));

        for (let i = 1; i <= opts.points! * 2; i++) {
            const radius = i % 2 === 0 ? opts.outerRadius! : opts.innerRadius!;
            const currentAngle = i * angle / 2 + rotation;
            ctx.lineTo(centerX + radius * Math.cos(currentAngle),
                centerY + radius * Math.sin(currentAngle));
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        return canvas;
    }
}

// 预设样式
export const particleStyles = {
    heart: {
        default: {},
        pink: {
            color: '#ff69b4',
            glowColor: '#ff1493',
            glowStrength: 0.9
        },
        red: {
            color: '#ff0000',
            glowColor: '#ff4444',
            glowStrength: 0.8
        },
        golden: {
            color: '#ffd700',
            glowColor: '#daa520',
            glowStrength: 0.7
        },
        neon: {
            color: '#ffffff',
            glowColor: '#00ffff',
            glowStrength: 1,
            strokeWidth: 2
        }
    },
    dot: {
        default: {},
        soft: {
            fadeStart: 0.4,
            fadeEnd: 0.8,
            opacity: 0.9
        },
        sharp: {
            fadeStart: 0.7,
            fadeEnd: 0.9,
            opacity: 1
        }
    },
    star: {
        default: {},
        classic: {
            points: 5,
            innerRadius: 4,
            outerRadius: 8,
            glowStrength: 0.7
        },
        sparkle: {
            points: 8,
            innerRadius: 3,
            outerRadius: 10,
            glowStrength: 1,
            rotation: 22.5
        }
    }
} as const;