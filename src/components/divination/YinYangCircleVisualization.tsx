import React from "react";
import {YAO} from "@/stores/YAO";

interface YinYangCircleVisualizationProps {
    yao: YAO;
    centerColor?: string;
    yinColor?: string;
    yangColor?: string;
    size?: number;
    dotSize?: number;
    centerFontSize?: number;
    circleStrokeWidth?: number,
    dotStrokeWidth?: string,
}

export const YinYangCircleVisualization: React.FC<YinYangCircleVisualizationProps> = ({
    yao,
    centerColor = "transparent", // blue center
    yinColor = "yellow",    // yellow for yin
    yangColor = "red",   // green for yang
    size = 200,
    dotSize = 1,
    centerFontSize = 18,
    circleStrokeWidth = 2,
    dotStrokeWidth = "0.5",
}) => {
    // Calculate viewBox dimensions
    const viewBoxSize = size;
    const center = viewBoxSize / 2;
    const maxRadius = viewBoxSize * 0.45; // Leave some margin

    // Calculate ring properties
    const centerRadius = maxRadius * 0.4; // Size of the center circle
    const ringWidth = (maxRadius - centerRadius) / 3;
    // const strokeWidth = 2; // Thin line for the circles

    if (yao === undefined) {
        return null;
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            className="overflow-visible"
        >
            {/* Center circle */}
            {/* <circle
                cx={center}
                cy={center}
                r={centerRadius}
                fill={centerColor}
            /> */}

            {/* Center text - display finalUndividedGroupCount */}
            {yao.isCompleted() && (
                <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={centerFontSize}
                    fontWeight="bold"
                >
                    {yao.getFinalUndividedGroupCount()}
                </text>
            )}

            {/* Rings */}
            {yao.getYinCounts().map((yinCount, index) => {
                const ringIndex = 3 - index; // Reverse order to draw outer rings first
                const radius = centerRadius + ringIndex * ringWidth;

                // Calculate yin-yang ratio
                const yinRatio = yinCount / (yinCount + yao.getYangCounts()[index]);

                // Calculate angles for the arc - starting from top (π/2 offset)
                const startAngle = -Math.PI / 2; // Start from top (270 degrees)
                const yinEndAngle = startAngle + (2 * Math.PI * yinRatio);
                const yangEndAngle = startAngle + (2 * Math.PI);

                // Generate dots for yin and yang - centered in the middle of each arc
                const yinDots = generateCenteredDots(
                    center,
                    center,
                    radius,
                    startAngle,
                    yinEndAngle,
                    yao.getYinLeftCounts(true)[index],
                    dotSize // Dot size
                );

                const yangDots = generateCenteredDots(
                    center,
                    center,
                    radius,
                    yinEndAngle,
                    yangEndAngle,
                    yao.getYangLeftCounts()[index],
                    dotSize // Dot size
                );

                return (
                    <g key={`ring-${index}`}>
                        {/* Yin arc */}
                        <path
                            d={describeArc(center, center, radius, startAngle, yinEndAngle)}
                            fill="none"
                            stroke={yinColor}
                            strokeWidth={circleStrokeWidth}
                            strokeLinecap="round"
                        />

                        {/* Yang arc */}
                        <path
                            d={describeArc(center, center, radius, yinEndAngle, yangEndAngle)}
                            fill="none"
                            stroke={yangColor}
                            strokeWidth={circleStrokeWidth}
                            strokeLinecap="round"
                        />

                        {/* Yin dots */}
                        {yinDots.map((dot, i) => (
                            <circle
                                key={`yin-dot-${i}`}
                                cx={dot.x}
                                cy={dot.y}
                                r={dot.r}
                                fill={yinColor}
                                stroke="#fff"
                                strokeWidth={dotStrokeWidth}
                            />
                        ))}

                        {/* Yang dots */}
                        {yangDots.map((dot, i) => (
                            <circle
                                key={`yang-dot-${i}`}
                                cx={dot.x}
                                cy={dot.y}
                                r={dot.r}
                                fill={yangColor}
                                stroke="#fff"
                                strokeWidth="0.5"
                            />
                        ))}
                    </g>
                );
            })}
        </svg>
    );
};

// Helper function to describe an arc path for a thin line
function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
): string {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

// Helper function to convert polar coordinates to Cartesian
function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInRadians: number
): { x: number; y: number } {
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Helper function to generate dots centered in the middle of an arc
function generateCenteredDots(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    count: number,
    dotRadius: number,
): { x: number; y: number; r: number }[] {
    const dots: { x: number; y: number; r: number }[] = [];

    if (count <= 0) return dots;

    // Calculate the middle angle of the arc
    const arcLength = endAngle - startAngle;
    const middleAngle = startAngle + (arcLength / 2);

    // Calculate how much space the dots will take
    const dotSpacing = dotRadius * 3; // Space between dots
    const totalDotsWidth = (count * dotRadius * 2) + ((count - 1) * dotSpacing);

    // Calculate the starting angle for the first dot
    const dotsStartAngle = middleAngle - (totalDotsWidth / (2 * radius));

    // Generate dots
    for (let i = 0; i < count; i++) {
        const angle = dotsStartAngle + (i * (dotRadius * 2 + dotSpacing) / radius);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        dots.push({ x, y, r: dotRadius });
    }

    return dots;
} 