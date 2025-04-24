import {useEffect, useMemo} from "react";
import {Mesh, TextureLoader} from "three";
import {useLoader} from "@react-three/fiber";
import {Sphere} from "@react-three/drei";
import {PlanetData} from "@/lib/planetsData.tsx";
import SaturnRings from "./SaturnRings.tsx";
import {usePlanetPositions} from "@/contexts/PlanetPositionsContext.tsx";

type ExtendedPlanetData = PlanetData & {
  orbitProgress: number;
  meshRef?: React.RefObject<Mesh>;
};

export default function Planet({
  name,
  texturePath,
  position,
  radius,
  orbitProgress,
  tilt,
  rotationSpeed,
  rings,
  meshRef
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

  useEffect(() => {
    setPlanetPosition(name, [x, 0, z]);
  }, [x, z, name, setPlanetPosition]);

  return (
    <>
      <mesh ref={meshRef} position={[x, 0, z]} rotation={[tilt, 0, 0]} scale={0.8}>
        <Sphere args={sphereArgs}>
          <meshBasicMaterial map={texture} />
        </Sphere>
        {rings && (
          <SaturnRings
            texturePath={rings.texturePath}
            innerRadius={rings.size[1] - 0.03}
            outerRadius={rings.size[1]}
          />
        )}
      </mesh>
    </>
  );
}
