import {useRef} from "react";
import {useThree} from "@react-three/fiber";
import {Vector3} from "three";
import {OrbitControls as DreiOrbitControls} from "@react-three/drei";
import {useCameraSetup} from "../../hooks/useCameraSetup";

export default function CameraController() {
  useCameraSetup();
  const { camera, invalidate } = useThree();

  // useControls('camera', {
  //   fov: {
  //     value: 50,
  //     min: 1,
  //     max: 100,
  //     step: 0.1,
  //     onChange: (v) => {
  //       (camera as PerspectiveCamera).fov = v;
  //       (camera as PerspectiveCamera).updateProjectionMatrix();
  //       invalidate();
  //     },
  //   },
  //   x: {
  //     value: 0,
  //     min: -100,
  //     max: 100,
  //     step: 1,
  //     onChange: (v) => {
  //       camera.position.x = v;
  //       invalidate();
  //     },
  //   },
  //   y: {
  //     value: 9,
  //     min: -100,
  //     max: 100,
  //     step: 0.1,
  //     onChange: (v) => {
  //       camera.position.y = v;
  //       invalidate();
  //     },
  //   },
  //   z: {
  //     value: 27,
  //     min: -100,
  //     max: 100,
  //     step: 0.1,
  //     onChange: (v) => {
  //       camera.position.z = v;
  //       invalidate();
  //     },
  //   },
  //   zoom: {
  //     value: 1,
  //     min: 1,
  //     max: 100,
  //     step: 1,
  //     onChange: (v) => {
  //       camera.zoom = v;
  //       invalidate();
  //     },
  //   },
  //   cameraTarget: {
  //     value: { x: 0, y: 0, z: 0 },
  //     step: 0.01,
  //     onChange: (v) => {
  //       orbitControlsRef.current.target.copy(v);
  //       invalidate();
  //     },
  //   },
  // });
  // const { cameraState, setCameraState } = useUIStore();

  // useControls({
  //   cameraState: {
  //     value: cameraState,
  //     options: Object.values(CameraState).reduce((acc, state) => {
  //       acc[state] = state;
  //       return acc;
  //     }, {}),
  //     onChange: (value) => {
  //       setCameraState(value as CameraState);
  //     }
  //   }
  // });

  const orbitControlsRef = useRef(null);

  return (
    <DreiOrbitControls
      ref={orbitControlsRef}
      enableRotate={true}
      enableZoom={true}
      enablePan={true}
      camera={camera}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 4}
      maxAzimuthAngle={Math.PI / 4}
      maxDistance={10}
      minDistance={1}
      target={new Vector3(0, 0, 0)}
      maxZoom={100}
      makeDefault
    />
  );
}
