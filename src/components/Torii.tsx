import {useGLTF} from "@react-three/drei";
import {FC} from "react";
import {GLTF} from "three-stdlib";
import * as THREE from "three";
import {GroupProps} from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    "Node-Mesh": THREE.Mesh;
    "Node-Mesh_1": THREE.Mesh;
  };
  materials: {
    mat23: THREE.Material;
    mat14: THREE.Material;
  };
};

type ToriiProps = GroupProps;

export const Torii: FC<ToriiProps> = (props) => {
  const { nodes, materials } = useGLTF("./models/torii/model.glb") as GLTFResult;
  
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes["Node-Mesh"].geometry} material={materials.mat23} />
      <mesh
        geometry={nodes["Node-Mesh_1"].geometry}
        material={materials.mat14}
      />
    </group>
  );
};

useGLTF.preload("./models/torii/model.glb");