// Sun has radius of 1 and position of 0,0,0
import {Vector3} from 'three';

const baseOrbitSpeed = 1;

export interface PlanetData {
  id: number;
  name: string;
  texturePath: string;
  position: Vector3;
  radius: number;
  rotationSpeed: number;
  tilt: number;
  orbitSpeed: number;
  wobble?: boolean;
  rings?: RingsData;
  orbitalPosition?: Vector3;
}

export interface RingsData {
  texturePath: string;
  size: [number, number];
}



const planetsData: PlanetData[] = [
  {
    id: 1,
    name: "Mercury",
    texturePath: "/images/planets/mercury.jpg",
    position: new Vector3(1.5, 0, 0),
    radius: 0.1,
    rotationSpeed: 1,
    tilt: 0.00017,
    orbitSpeed: baseOrbitSpeed / 0.24,
  },
  {
    id: 2,
    name: "Venus",
    texturePath: "/images/planets/venus.jpg",
    position: new Vector3(2.2, 0, 0),
    radius: 0.15,
    rotationSpeed: 1,
    tilt: 3.09639,
    orbitSpeed: baseOrbitSpeed / 0.62,
  },
  {
    id: 3,
    name: "Earth",
    texturePath: "/images/planets/earth.jpg",
    position: new Vector3(3, 0, 0),
    radius: 0.15,
    rotationSpeed: 1,
    tilt: 0.40928,
    orbitSpeed: 0.6,
  },
  {
    id: 4,
    name: "Mars",
    texturePath: "/images/planets/mars.jpg",
    position: new Vector3(4, 0, 0),
    radius: 0.13,
    rotationSpeed: 0.5,
    tilt: 0.43965,
    orbitSpeed: baseOrbitSpeed / 1.88,
  },
  {
    id: 5,
    name: "Jupiter",
    texturePath: "/images/planets/jupiter.jpg",
    position: new Vector3(6, 0, 0),
    radius: 0.25,
    rotationSpeed: 0.2,
    tilt: 0.05463,
    orbitSpeed: baseOrbitSpeed / 11.86,
  },
  {
    id: 6,
    name: "Saturn",
    texturePath: "/images/planets/saturn.jpg",
    position: new Vector3(9, 0, 0),
    radius: 0.2,
    rotationSpeed: 0.1,
    tilt: 0.46653,
    orbitSpeed: baseOrbitSpeed / 29.46,
    rings: {
      texturePath: "/images/planets/saturn_rings.jpg",
      size: [0.2, 0.46],
    },
  },
  {
    id: 7,
    name: "Uranus",
    texturePath: "/images/planets/uranus.webp",
    position: new Vector3(13, 0, 0),
    radius: 0.18,
    rotationSpeed: 0.07,
    tilt: 1.70622,
    orbitSpeed: baseOrbitSpeed / 84.01,
  },
  {
    id: 8,
    name: "Neptune",
    texturePath: "/images/planets/neptune_2k.webp",
    position: new Vector3(17, 0, 0),
    radius: 0.18,
    rotationSpeed: 0.06,
    tilt: 0.49428,
    orbitSpeed: baseOrbitSpeed / 164.8,
  },

];

export default planetsData;
