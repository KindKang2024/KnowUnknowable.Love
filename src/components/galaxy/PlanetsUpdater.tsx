// PlanetsUpdater.tsx
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {PlanetData} from "@/lib/planetsData.tsx";
// import {useSpeedControl} from "@/contexts/SpeedControlContext";

type PlanetsUpdaterProps = {
  setPlanetOrbitProgress: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  planets: PlanetData[];
};

// const ORBIT_SPEED_FACTOR = 50;
const ORBIT_SPEED_FACTOR = 1000;

export default function PlanetsUpdater({
  setPlanetOrbitProgress,
  planets,
}: PlanetsUpdaterProps) {
  // const { speedFactor } = useSpeedControl();
  const speedFactor = 1;
  const lastElapsedTimeRef = useRef(0);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastElapsedTimeRef.current;
    lastElapsedTimeRef.current = elapsedTime;

    setPlanetOrbitProgress((prevOrbitProgress) => {
      return planets.reduce(
        (acc, planet) => {
          const orbitSpeedRadians =
            ((planet.orbitSpeed * ORBIT_SPEED_FACTOR) / 3600) *
            (2 * Math.PI) *
            speedFactor * .1;
          acc[planet.name] =
            (prevOrbitProgress[planet.name] || 0) -
            orbitSpeedRadians * deltaTime;
          return acc;
        },
        { ...prevOrbitProgress }
      );
    });
  });

  return null;
}
