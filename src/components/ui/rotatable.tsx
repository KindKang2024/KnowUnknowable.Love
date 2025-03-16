import React, {useEffect, useState} from 'react';
import {animated, useSpring} from '@react-spring/web';

interface RotatableProps {
    children: React.ReactNode;
    className?: string;
    instructionText?: boolean;
}

export const Rotatable: React.FC<RotatableProps> = ({
    children,
    className = '',
    instructionText = true,
}) => {
    // Track rotation state
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Track mouse/touch position
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    // Spring animation for smooth rotation
    const props = useSpring({
        transform: `rotate(${rotation}deg)`,
        config: { mass: 1, tension: 170, friction: 26 }
    });

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Calculate rotation based on mouse/touch movement
    const calculateRotation = (clientX: number, clientY: number, elementRect: DOMRect) => {
        // Calculate center of element
        const centerX = elementRect.left + elementRect.width / 2;
        const centerY = elementRect.top + elementRect.height / 2;

        // Calculate angle between center and current position
        const angleStart = Math.atan2(startPos.y - centerY, startPos.x - centerX);
        const angleCurrent = Math.atan2(clientY - centerY, clientX - centerX);

        // Convert to degrees and calculate difference
        const angleDelta = (angleCurrent - angleStart) * (180 / Math.PI);

        // Return new rotation
        return rotation + angleDelta;
    };

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default behavior

        const rect = e.currentTarget.getBoundingClientRect();
        setStartPos({ x: e.clientX, y: e.clientY });
        setLastPos({ x: e.clientX, y: e.clientY });
        setIsDragging(true);

        // Add window event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        e.preventDefault(); // Prevent default behavior

        const element = document.getElementById('rotatable-element');
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const newRotation = calculateRotation(e.clientX, e.clientY, rect);

        setRotation(newRotation);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e) e.preventDefault(); // Prevent default behavior

        setIsDragging(false);

        // Remove window event listeners
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 0) return;

        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();

        setStartPos({ x: touch.clientX, y: touch.clientY });
        setLastPos({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length === 0) return;

        // Prevent scrolling while rotating
        e.preventDefault();

        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const newRotation = calculateRotation(touch.clientX, touch.clientY, rect);

        setRotation(newRotation);
        setStartPos({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsDragging(false);
    };

    return (
        <div className={`relative ${className}`}>
            <div
                id="rotatable-element"
                className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''} select-none`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <animated.div style={props}>
                    {children}
                </animated.div>
            </div>

            {instructionText && (
                <div className="mt-2 text-center text-sm text-purple-300 opacity-75">
                    Click and drag to rotate
                </div>
            )}
        </div>
    );
};

export default Rotatable;