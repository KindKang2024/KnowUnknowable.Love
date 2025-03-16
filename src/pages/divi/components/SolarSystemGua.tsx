// SolarSystem.tsx
import {useState} from "react";
import {PlanetData} from "../../../../types.ts";
import Sun from "./Sun.tsx";
import Planet from "./Planets.tsx";
import PlanetsUpdater from "../../../components/galaxy/PlanetsUpdater.tsx";
import planetsData from "@/lib/planetsData.tsx";

type SolarSystemGuaProps = {
  position: [number, number, number];
  scale: number;
};
export default function SolarSystemGua({ position = [0, 0, 0], scale = 1 }: SolarSystemGuaProps) {
  const [planetOrbitProgress, setPlanetOrbitProgress] = useState<{
    [key: string]: number;
  }>(
    planetsData.reduce<{ [key: string]: number }>((acc, planet: PlanetData) => {
      acc[planet.name] = 0;
      return acc;
    }, {})
  );

  return (
    <>
      {/* <SceneLighting /> */}
      <group position={position} scale={scale}>
        <Sun position={[0, 0, 0]} radius={0.58} />
        {planetsData.map((planet) => (
          <Planet
            key={planet.id}
            id={planet.id}
            name={planet.name}
            texturePath={planet.texturePath}
            position={planet.position}
            radius={planet.radius}
            rotationSpeed={planet.rotationSpeed}
            tilt={planet.tilt}
            orbitSpeed={planet.orbitSpeed}
            moons={planet.moons}
            wobble={planet.wobble}
            rings={planet.rings}
            orbitProgress={planetOrbitProgress[planet.name]}
            displayStats={planet.displayStats}
          />
        ))}
      </group>
      <PlanetsUpdater
        setPlanetOrbitProgress={setPlanetOrbitProgress}
        planets={planetsData}
      />
    </>
  );
}
