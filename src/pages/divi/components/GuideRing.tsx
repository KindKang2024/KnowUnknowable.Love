import {Torus} from "@react-three/drei";
import {useCameraContext} from "../../../contexts/CameraContext.tsx";
import {animated} from "@react-spring/three";

export default function GuideRing({ radius }: { radius: number }) {
  const { cameraState } = useCameraContext();

  const targetOpacity = (() => {
    switch (cameraState) {
      case "FREE":
      case "MOVING_TO_HOME":
        return 1;
      case "INTRO_ANIMATION":
        return 1;
      case "ZOOMING_IN":
        return 0;
      case "DETAIL_VIEW":
        return 0;
      default:
        return 0;
    }
  })();

  const AnimatedMaterial = animated("meshBasicMaterial");

  return (
    <mesh>
      <Torus
        args={[radius, 0.002, 16, 500]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <AnimatedMaterial color="#666" transparent />
      </Torus>
    </mesh>
  );
}
