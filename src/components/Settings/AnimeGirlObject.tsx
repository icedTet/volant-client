import { VRM, VRMSchema } from "@pixiv/three-vrm";
import { PerspectiveCamera, Vector3 } from "three";
import React, { useEffect } from "react";

export const AnimeGirlObject = (props: {
  model: VRM;
  camera: React.MutableRefObject<PerspectiveCamera | null>;
}) => {
  const { model, camera } = props;
  // const { actions, clips, names, mixer, ref } = useAnimations(
  //   animation,
  //   model.scene
  // );
  // useEffect(() => {
  //   actions?.vrmAnimation?.reset();
  //   actions?.vrmAnimation?.setLoop(LoopRepeat, 999999);
  //   actions?.vrmAnimation?.play();
  //   console.log("PLAYING", actions?.vrmAnimation);
  // }, []);
  useEffect(() => {
    const newVector = new Vector3(0, 0, 0);
    if (!model) return;
    model.humanoid
      ?.getBoneNode(VRMSchema.HumanoidBoneName.Head)
      ?.getWorldPosition(newVector);
    console.log("renderVector", newVector);
    if (newVector)
      camera?.current?.position.set(
        0,
        newVector.y,
        newVector.z + (newVector.y * 1) ** 0.7
      );
  }, [model]);

  return (
    <group key={`previewModel-${model.scene.uuid}`}>
      <primitive object={model.scene} />
    </group>
  );
};
