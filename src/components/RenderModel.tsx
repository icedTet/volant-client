import { VRM } from "@pixiv/three-vrm";
import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { PerspectiveCamera as PCamera, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

export const RenderModel = (props: { model: VRM }) => {
  const { model } = props;
  const camera = useRef<THREE.PerspectiveCamera>();
  return (
    <Canvas
      // eventSource={globalThis?.document?.getElementById("root")!}
      // eventPrefix="client"
      shadows={true}
      className={`bg-gray-500 w-full h-full absolute top-0 left-0`}
      frameloop="demand"
    >
      <PCamera
        position={new Vector3(-1, 0, 4)}
        makeDefault
        zoom={1}
        ref={camera}
      ></PCamera>
      {/* <CLog /> */}

      <OrbitControls camera={camera.current} enableDamping={false} />
      <group>
        <primitive object={model.scene} />
      </group>
      {/* <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={"orange"} />
        </mesh>  */}
    </Canvas>
  );
};
