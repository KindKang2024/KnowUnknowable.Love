import React, {useEffect, useRef, useState} from "react";

interface PlanetInfo {
    period: number; // orbital period (not used here but could be useful)
    orbitRadius: number;
    speed: number; // angular speed (radians per second)
}

const planetData: Record<string, PlanetInfo> = {
    Mercury: { period: 88, orbitRadius: 60, speed: 0.05 },
    Venus: { period: 225, orbitRadius: 90, speed: 0.03 },
    Earth: { period: 365, orbitRadius: 120, speed: 0.02 },
    Mars: { period: 687, orbitRadius: 150, speed: 0.015 },
    Jupiter: { period: 4333, orbitRadius: 200, speed: 0.01 },
    Saturn: { period: 10759, orbitRadius: 250, speed: 0.007 },
    Uranus: { period: 30687, orbitRadius: 300, speed: 0.005 },
    Neptune: { period: 60190, orbitRadius: 350, speed: 0.003 },
};

const PlanetVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [planet1, setPlanet1] = useState("Earth");
    const [planet2, setPlanet2] = useState("Jupiter");
    const [isRunning, setIsRunning] = useState(false);

    const canvasSize = { width: 800, height: 800 };
    const center = { x: canvasSize.width / 2, y: canvasSize.height / 2 };

    useEffect(() => {
        let animationFrameId: number;
        let startTime: number | null = null;
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        // Fill background and draw the sun and orbits (initial setup)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        // Draw the sun at the center.
        ctx.beginPath();
        ctx.arc(center.x, center.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();

        // Draw orbit circles for the two selected planets.
        const drawOrbits = () => {
            [planet1, planet2].forEach((planet) => {
                const { orbitRadius } = planetData[planet];
                ctx.beginPath();
                ctx.arc(center.x, center.y, orbitRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        };
        drawOrbits();

        // Animation loop: computes positions based on elapsed time and draws the connection line.
        const render = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000; // elapsed time in seconds

            // Compute each planet's angle based on its speed.
            const angle1 = elapsed * planetData[planet1].speed;
            const angle2 = elapsed * planetData[planet2].speed;

            // Calculate positions on their circular orbits.
            const p1 = {
                x: center.x + planetData[planet1].orbitRadius * Math.cos(angle1),
                y: center.y + planetData[planet1].orbitRadius * Math.sin(angle1),
            };

            const p2 = {
                x: center.x + planetData[planet2].orbitRadius * Math.cos(angle2),
                y: center.y + planetData[planet2].orbitRadius * Math.sin(angle2),
            };

            // Draw the connecting line (the trace is preserved because we do not clear the canvas each frame).
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(0,255,0,0.7)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Optionally, draw the planets.
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();

            if (isRunning) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        if (isRunning) {
            animationFrameId = requestAnimationFrame(render);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRunning, planet1, planet2]);

    // Render the controls and the canvas.
    return (
        <div>
            <h2>Planetary Geometric Pattern Visualizer</h2>
            <div>
                <label>
                    Planet 1:
                    <select value={planet1} onChange={(e) => setPlanet1(e.target.value)}>
                        {Object.keys(planetData).map((planet) => (
                            <option key={planet} value={planet}>
                                {planet}
                            </option>
                        ))}
                    </select>
                </label>
                <label style={{ marginLeft: "1rem" }}>
                    Planet 2:
                    <select value={planet2} onChange={(e) => setPlanet2(e.target.value)}>
                        {Object.keys(planetData).map((planet) => (
                            <option key={planet} value={planet}>
                                {planet}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div style={{ marginTop: "1rem" }}>
                <button onClick={() => setIsRunning(true)}>Start</button>
                <button onClick={() => setIsRunning(false)} style={{ marginLeft: "1rem" }}>
                    Stop
                </button>
                <button
                    onClick={() => {
                        // Clear the canvas and redraw the static background (sun plus orbits).
                        const ctx = canvasRef.current?.getContext("2d");
                        if (ctx) {
                            ctx.fillStyle = "black";
                            ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
                            ctx.beginPath();
                            ctx.arc(center.x, center.y, 20, 0, Math.PI * 2);
                            ctx.fillStyle = "yellow";
                            ctx.fill();
                            [planet1, planet2].forEach((planet) => {
                                const { orbitRadius } = planetData[planet];
                                ctx.beginPath();
                                ctx.arc(center.x, center.y, orbitRadius, 0, Math.PI * 2);
                                ctx.strokeStyle = "gray";
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            });
                        }
                    }}
                    style={{ marginLeft: "1rem" }}
                >
                    Clear
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ border: "1px solid #ccc", marginTop: "1rem" }}
            />
        </div>
    );
};

export default PlanetVisualizer; 