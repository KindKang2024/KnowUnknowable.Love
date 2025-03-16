import {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function genRand(min: number, max: number, decimalPlaces: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimalPlaces));
}

function Stars() {
    const group = useRef<THREE.Group>(null);
    let theta = 0;
    useFrame(() => {
        const r = 5 * Math.sin(THREE.MathUtils.degToRad((theta += 0.01)));
        if (group.current) {
            group.current.rotation.set(r, r, r);
        }
    });

    const [geo, mat, coords] = useMemo(() => {
        const geo = new THREE.SphereGeometry(1, 5, 5);
        const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("white")
        });
        const coords = new Array(2000)
            .fill(null)
            .map(() => [
                randomNumber(-2000, 2000),
                randomNumber(-2000, 2000),
                randomNumber(-2000, 2000),
            ]);
        return [geo, mat, coords];
    }, []);

    return (
        <group ref={group}>
            {coords.map(([p1, p2, p3], i) => (
                <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
            ))}
        </group>
    );
}
export default Stars;
