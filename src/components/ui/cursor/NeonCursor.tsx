import {useCallback, useEffect, useState} from 'react';
import {animated, useSpring} from '@react-spring/web';
import './NeonCursor.css';


const useCanvasCursor = () => {
    function n(e) {
        this.init(e || {});
    }
    n.prototype = {
        init: function (e) {
            this.phase = e.phase || 0;
            this.offset = e.offset || 0;
            this.frequency = e.frequency || 0.001;
            this.amplitude = e.amplitude || 1;
        },
        update: function () {
            return (
                (this.phase += this.frequency),
                (e = this.offset + Math.sin(this.phase) * this.amplitude)
            );
        },
        value: function () {
            return e;
        },
    };

    function Line(e) {
        this.init(e || {});
    }

    Line.prototype = {
        init: function (e) {
            this.spring = e.spring + 0.1 * Math.random() - 0.02;
            this.friction = E.friction + 0.01 * Math.random() - 0.002;
            this.nodes = [];
            for (var t, n = 0; n < E.size; n++) {
                t = new Node();
                t.x = pos.x;
                t.y = pos.y;
                this.nodes.push(t);
            }
        },
        update: function () {
            var e = this.spring,
                t = this.nodes[0];
            t.vx += (pos.x - t.x) * e;
            t.vy += (pos.y - t.y) * e;
            for (var n, i = 0, a = this.nodes.length; i < a; i++)
                (t = this.nodes[i]),
                    0 < i &&
                    ((n = this.nodes[i - 1]),
                        (t.vx += (n.x - t.x) * e),
                        (t.vy += (n.y - t.y) * e),
                        (t.vx += n.vx * E.dampening),
                        (t.vy += n.vy * E.dampening)),
                    (t.vx *= this.friction),
                    (t.vy *= this.friction),
                    (t.x += t.vx),
                    (t.y += t.vy),
                    (e *= E.tension);
        },
        draw: function () {
            var e,
                t,
                n = this.nodes[0].x,
                i = this.nodes[0].y;
            ctx.beginPath();
            ctx.moveTo(n, i);
            for (var a = 1, o = this.nodes.length - 2; a < o; a++) {
                e = this.nodes[a];
                t = this.nodes[a + 1];
                n = 0.5 * (e.x + t.x);
                i = 0.5 * (e.y + t.y);
                ctx.quadraticCurveTo(e.x, e.y, n, i);
            }
            e = this.nodes[a];
            t = this.nodes[a + 1];
            ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
            ctx.stroke();
            ctx.closePath();
        },
    };

    function onMousemove(e) {
        function o() {
            lines = [];
            for (var e = 0; e < E.trails; e++)
                lines.push(new Line({ spring: 0.4 + (e / E.trails) * 0.025 }));
        }
        function c(e) {
            e.touches
                ? ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY))
                : ((pos.x = e.clientX), (pos.y = e.clientY)),
                e.preventDefault();
        }
        function l(e) {
            1 == e.touches.length &&
                ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY));
        }
        document.removeEventListener('mousemove', onMousemove),
            document.removeEventListener('touchstart', onMousemove),
            document.addEventListener('mousemove', c),
            document.addEventListener('touchmove', c),
            document.addEventListener('touchstart', l),
            c(e),
            o(),
            render();
    }

    function render() {
        if (ctx.running) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',50%,50%,0.2)';
            ctx.lineWidth = 1;
            for (var e, t = 0; t < E.trails; t++) {
                (e = lines[t]).update();
                e.draw();
            }
            ctx.frame++;
            window.requestAnimationFrame(render);
        }
    }

    function resizeCanvas() {
        ctx.canvas.width = window.innerWidth - 20;
        ctx.canvas.height = window.innerHeight;
    }

    var ctx,
        f,
        e = 0,
        pos = { x: 0, y: 0 },
        lines = [],
        E = {
            debug: true,
            friction: 0.5,
            trails: 20,
            size: 50,
            dampening: 0.25,
            tension: 0.98,
        };
    function Node() {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
    }

    const renderCanvas = function () {
        ctx = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
        ctx.running = true;
        ctx.frame = 1;
        f = new n({
            phase: Math.random() * 2 * Math.PI,
            amplitude: 85,
            frequency: 0.0015,
            offset: 285,
        });
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('touchstart', onMousemove);
        document.body.addEventListener('orientationchange', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('focus', () => {
            if (!ctx.running) {
                ctx.running = true;
                render();
            }
        });
        window.addEventListener('blur', () => {
            ctx.running = true;
        });
        resizeCanvas();
    };

    useEffect(() => {
        renderCanvas();

        return () => {
            ctx.running = false;
            document.removeEventListener('mousemove', onMousemove);
            document.removeEventListener('touchstart', onMousemove);
            document.body.removeEventListener('orientationchange', resizeCanvas);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('focus', () => {
                if (!ctx.running) {
                    ctx.running = true;
                    render();
                }
            });
            window.removeEventListener('blur', () => {
                ctx.running = true;
            });
        };
    }, []);
};

const NeonCursor = () => {
    // State for mouse position and interaction states
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Spring for the main cursor dot
    const mainCursorSpring = useSpring({
        // left: position.x - 10,
        // top: position.y - 10,
        left: position.x - 3,
        top: position.y - 3,
        transform: `scale(${isClicking ? 0.8 : isHovering ? 1.2 : 1})`,
        config: { mass: 0.5, tension: 400, friction: 20 },
    });

    // Spring for the trailing circle
    const trailSpring = useSpring({
        left: position.x - 20,
        top: position.y - 20,
        transform: `scale(${isHovering ? 1.5 : 1})`,
        borderColor: isHovering ? 'rgb(252, 252, 251)' : 'rgb(249, 238, 232)',
        borderWidth: isHovering ? '3px' : '2px',
        config: { mass: 0.8, tension: 200, friction: 30 },
    });

    // Spring for the outer glow
    const glowSpring = useSpring({
        // left: position.x - 30,
        // top: position.y - 30,
        left: position.x - 15,
        top: position.y - 15,
        transform: `scale(${isHovering ? 2 : 1})`,
        opacity: isHovering ? 0.8 : 0.4,
        config: { mass: 1, tension: 150, friction: 40 },
    });

    // Event handlers
    const handleMouseMove = useCallback((e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = useCallback((e) => {
        const target = e.target;
        if (target.matches('a, button, input, [data-hover="true"]')) {
            setIsHovering(true);
        }
    }, []);

    const handleMouseOut = useCallback(() => {
        setIsHovering(false);
    }, []);

    // Add and clean up event listeners
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [handleMouseMove, handleMouseOver, handleMouseOut]);

    // Render the animated elements
    return (
        <div className="neon-cursor-container">
            <animated.div className="cursor-main" style={mainCursorSpring} />
            <animated.div className="cursor-trail" style={trailSpring} />
            <animated.div className="cursor-glow" style={glowSpring} />
        </div>
    );
};

export default NeonCursor;

