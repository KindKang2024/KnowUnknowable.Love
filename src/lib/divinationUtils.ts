import * as THREE from 'three';


export function findCircleIntersection(p1: THREE.Vector3, p2: THREE.Vector3, radius: number): THREE.Vector3 | null {
    // Convert line segment to parametric form: p = p1 + t(p2-p1)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Coefficients of quadratic equation at^2 + bt + c = 0
    const a = dx * dx + dy * dy;
    const b = 2 * (p1.x * dx + p1.y * dy);
    const c = p1.x * p1.x + p1.y * p1.y - radius * radius;

    // Solve quadratic equation
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return null; // No intersection
    }

    // Find intersection points
    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    // Check if intersection points lie within the line segment (0 <= t <= 1)
    const validT = [t1, t2].filter(t => t >= 0 && t <= 1);

    if (validT.length === 0) {
        return null;
    }

    // Use the first valid intersection point
    const t = validT[0];
    return new THREE.Vector3(
        p1.x + t * dx,
        p1.y + t * dy,
        0
    );
}

export function createRandom2DCirclePositions(count: number, radius: number): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius * 0.95;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        positions.push(new THREE.Vector3(x, y, 0));
    }
    return positions;
}

// Spring-like lerp animation using just Math.lerp
export function springLerp(current: number, target: number, options: {
    // How fast the animation moves (like tension)
    speed?: number;
    // How quickly it slows down (like friction)
    damping?: number;
    // Precision for considering animation complete
    precision?: number;
    // Current velocity (maintained between frames)
    velocity?: number;
    // Delta time since last frame
    deltaTime?: number;
}): { value: number; velocity: number; isComplete: boolean } {
    const {
        speed = 10,
        damping = 0.8,
        precision = 0.001,
        velocity = 0,
        deltaTime = 1 / 60 // Default to 60fps
    } = options;

    // Calculate distance to target
    const distance = target - current;

    // Apply spring physics
    // 1. Calculate spring force based on distance
    const springForce = distance * speed;

    // 2. Apply damping to current velocity
    let newVelocity = velocity * damping;

    // 3. Add spring force to velocity
    newVelocity += springForce * deltaTime;

    // 4. Calculate new position
    const newValue = current + newVelocity * deltaTime;

    // Check if animation is complete (both close enough and moving slowly enough)
    const isComplete =
        Math.abs(distance) < precision &&
        Math.abs(newVelocity) < precision;

    return {
        value: newValue,
        velocity: newVelocity,
        isComplete
    };
}


// const vels = new Float32Array(count * 2);
// const baseSpeed = 0.001 * speedFactor;
// for (let i = 0; i < count; i++) {
//     const angle = Math.random() * Math.PI * 2;
//     vels[i * 2] = Math.cos(angle) * baseSpeed;
//     vels[i * 2 + 1] = Math.sin(angle) * baseSpeed;
// }
// // console.log('vels', vels);
// return vels;

export function createRandom2DVelocities(count: number, speedFactor: number): Float32Array {
    const vels = new Float32Array(count * 2);
    const baseSpeed = 0.001 * speedFactor;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        vels[i * 2] = Math.cos(angle) * baseSpeed;
        vels[i * 2 + 1] = Math.sin(angle) * baseSpeed;
    }
    return vels;
}

// Function to initialize positions with a given initial position
export function createInitialPositions(initialPos: THREE.Vector3, count: number): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = initialPos.x;
        positions[i3 + 1] = initialPos.y;
        positions[i3 + 2] = initialPos.z;
    }
    return positions;
};

// Create shatter pieces
export const createShatterPieces = () => {
    const pieces = [];
    const numPieces = 100; // Number of shatter pieces
    const radius = 6;

    for (let i = 0; i < numPieces; i++) {
        // Random position on sphere surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // Random velocity for the piece
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).multiplyScalar(0.5);

        pieces.push({
            position: new THREE.Vector3(x, y, z),
            velocity,
            rotation: new THREE.Vector3(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            size: 1 + Math.random() * 2
        });
    }
    return pieces;
};

export const calculateShatterPieces = (pieces: any[], delta: number) => {
    return pieces.map(piece => {
        piece.position.add(piece.velocity);
        piece.velocity.y -= delta * 2; // Add gravity
        return piece;
    }).filter(piece => piece.position.y > -10);
}
