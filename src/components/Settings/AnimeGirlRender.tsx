import { VRM } from "@pixiv/three-vrm";
import { Canvas } from "@react-three/fiber";

import React, { useEffect, useMemo } from "react";
import { Color, Group, Mesh, Vector3 } from "three";
import { PerspectiveCamera, Cylinder } from "@react-three/drei";
import { AnimeGirlObject } from "./AnimeGirlObject";

export const AnimeGirlRenderer = (props: { model?: VRM | null }) => {
  const { model } = props;
  // const [animations, setAnimations] = useState(null as AnimationClip[] | null);
  useEffect(() => {
    model?.scene.rotation.set(0, Math.PI, 0);
  }, [model]);
  // useEffect(() => {
  //   if (!model) return;
  //   loadMixamoAnimation("animation/Idle3.fbx", model).then((animations) => {
  //     setAnimations([animations]);
  //   });
  // }, [model]);
  useMemo(() => {
    if (!model) return;
    const meshes = [...model.scene.children];
    console.log("AA", meshes);
    while (meshes.length > 0) {
      const item = meshes[0];
      if (item.type === "Mesh") {
        const mesh = item as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      } else if (item.type === "Group") {
        const group = item as Group;
        meshes.push(...group.children);
      }
      meshes.shift();
    }
  }, [model?.scene]);

  const camera = React.useRef(null);
  const lightTarget = React.useRef(null);
  return (
    <Canvas
      eventSource={globalThis?.document?.getElementById("root")!}
      eventPrefix="client"
      shadows={"soft"}
      className={`bg-cyan-500 w-full h-full absolute top-0 left-0`}
    >
      {lightTarget.current && (
        <directionalLight
          // angle={0.1}
          color={new Color(128 / 255, 128 / 255, 255 / 255)}
          // penumbra={0}
          position={[0, 20, 0]}
          target={lightTarget.current}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={0}
          intensity={0.2}
          castShadow
        />
      )}
      {model && (
        <AnimeGirlObject model={model} camera={camera} />
      )}
      <ambientLight intensity={0.05} />
      <Cylinder
        args={[5, 5]}
        position={new Vector3(0, -0.5, 0)}
        receiveShadow
        ref={lightTarget}
      >
        <meshStandardMaterial color={"red"} roughness={1} />
      </Cylinder>
      <PerspectiveCamera
        position={new Vector3(0, 4, 10)}
        makeDefault
        zoom={1}
        ref={camera}
      ></PerspectiveCamera>
    </Canvas>
  );
};
