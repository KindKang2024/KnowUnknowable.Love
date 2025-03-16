import {useLoader} from "@react-three/fiber";
import {DoubleSide, TextureLoader} from "three";
import {Ring} from "@react-three/drei";

type SaturnRingsProps = {
  texturePath: string;
  innerRadius: number;
  outerRadius: number;
};

export default function SaturnRings({
  texturePath,
  innerRadius,
  outerRadius,
}: SaturnRingsProps) {
  const texture = useLoader(TextureLoader, texturePath);

  return (
    <Ring
      args={[innerRadius, outerRadius, 128]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial
        map={texture}
        side={DoubleSide}
        transparent={true}
      />
    </Ring>
  );
}
