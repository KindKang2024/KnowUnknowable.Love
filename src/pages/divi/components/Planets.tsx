import {useEffect, useMemo, useRef} from "react";
import {Mesh, TextureLoader} from "three";
import {useFrame, useLoader} from "@react-three/fiber";
import {Sphere} from "@react-three/drei";
import {PlanetData} from "../../../../types.ts";
import SaturnRings from "./SaturnRings.tsx";
import {usePlanetPositions} from "@/contexts/PlanetPositionsContext.tsx";

type ExtendedPlanetData = PlanetData & { orbitProgress: number };

export default function Planet({
  name,
  texturePath,
  position,
  radius,
  orbitProgress,
  tilt,
  rotationSpeed,
  rings,
}: ExtendedPlanetData) {
  const { setPlanetPosition } = usePlanetPositions();
  const texture = useLoader(TextureLoader, texturePath);
  const sphereArgs = useMemo(
    () => [radius, 64, 64] as [number, number, number],
    [radius]
  );
  const orbitRadius = position.x;
  const x = Math.cos(orbitProgress) * orbitRadius;
  const z = Math.sin(orbitProgress) * orbitRadius;
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      const rotationPerFrame = (rotationSpeed * (Math.PI / 180)) / 60;
      ref.current.rotation.y += rotationPerFrame;
    }
  });

  useEffect(() => {
    setPlanetPosition(name, [x, 0, z]);
  }, [x, z, name, setPlanetPosition]);

  return (
    <>
      <mesh ref={ref} position={[x, 0, z]} rotation={[tilt, 0, 0]}>
        <Sphere args={sphereArgs}>
          <meshStandardMaterial map={texture} />
        </Sphere>
        {rings && (
          <SaturnRings
            texturePath={rings.texturePath}
            innerRadius={rings.size[0]}
            outerRadius={rings.size[1]}
          />
        )}
      </mesh>
      {/* <Ring radius={orbitRadius} /> */}
    </>
  );
}
