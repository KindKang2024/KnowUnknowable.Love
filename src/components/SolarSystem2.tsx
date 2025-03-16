// SolarSystem.tsx
import {useState} from "react";
import {PlanetData} from "../../types";
import {Canvas} from "@react-three/fiber";
import Sun from "../pages/divi/components/Sun.tsx";
import Planet from "../pages/divi/components/Planets.tsx";
import CameraController from "./galaxy/CameraController.tsx";
import PlanetsUpdater from "./galaxy/PlanetsUpdater.tsx";
import PlanetMenu from "./ui/ControlMenu/PlanetMenu";
import PlanetDetail from "./ui/ControlMenu/PlanetDetail";
import ControlMenu from "./ui/ControlMenu/ControlMenu";
import SceneLighting from "./SceneLighting";
import IntroText from "./ui/ControlMenu/IntroText";
import Stars from "../pages/divi/components/Stars.tsx";
import planetsData from "@/lib/planetsData";

export default function SolarSystem2() {
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
      <div className="w-screen h-screen overflow-hidden"
        style={{
          backgroundColor: 'black'
        }}
      >
        <Canvas camera={{ position: [-100, 0, 100] }}>
          <CameraController />
          <Stars />
          <SceneLighting />
          <Sun position={[0, 0, 0]} radius={1} />
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
              orbitSpeed={planet.orbitSpeed * 10}
              moons={planet.moons}
              wobble={planet.wobble}
              rings={planet.rings}
              orbitProgress={planetOrbitProgress[planet.name]}
              displayStats={planet.displayStats}
            />
          ))}
          <PlanetsUpdater
            setPlanetOrbitProgress={setPlanetOrbitProgress}
            planets={planetsData}
          />
        </Canvas>
        <PlanetMenu planets={planetsData} />
        {/* <AnimatePresence> */}
        <div className="absolute bottom-0 left-0 right-0">
          <PlanetDetail />
        </div>
        {/* </AnimatePresence> */}
        <ControlMenu />
        <IntroText />
      </div>
    </>
  );
}
