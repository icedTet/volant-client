import { VRM, VRMSchema } from "@pixiv/three-vrm";
import React from "react";
import { useEffect } from "react";
import { PerspectiveCamera, Vector3 } from "three";

export const VRMFileRenderer = (props: {
  model: VRM;
  camera: React.MutableRefObject<PerspectiveCamera | null>;
}) => {
  const { model, camera } = props;
  useEffect(() => {
    const newVector = new Vector3(0, 0, 0);
    if (!model) return;
    model.humanoid
      ?.getBoneNode(VRMSchema.HumanoidBoneName.Head)
      ?.getWorldPosition(newVector);
    console.log("newModelVector", newVector, model);
    if (newVector)
      camera?.current?.position.set(
        0,
        newVector.y,
        newVector.z + (newVector.y * 0.7) ** 0.8
      );
  }, [model]);
  if (!model) {
    console.log("Model no exist!");
    return null;
  }
  console.log("ModelRenderer", model);

  return (
    <group key={`previewCardthing-${model.scene.uuid}`}>
      <primitive object={model?.scene} scale={1} />
    </group>
  );
};
