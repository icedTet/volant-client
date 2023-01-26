import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { ModelData, VRMLoader } from "../../utils/classes/VRMLoader";
import { VRMFileRenderer } from "./VRMFileRenderer";
import { PerspectiveCamera as PCamera } from "@react-three/drei";
import { PerspectiveCamera } from "three";
import { usePrimaryModel } from "../../utils/hooks/usePrimaryModel";
import { VRM } from "@pixiv/three-vrm";

export const AnimeGirlCard = (props: {
  data: ModelData;
  onClick: (model: ModelData) => void;
}) => {
  const { data, onClick } = props;
  const pmodel = usePrimaryModel();
  const [model, setModel] = useState(null as VRM | null);
  useEffect(() => {
    const load = async () => {
      const model = await VRMLoader.getInstance().getModel(data.id).getVRM();
      setModel(model);
    };

    if (!VRMLoader.getInstance().ready) {
      VRMLoader.getInstance().on("ready", () => {
        load();
      });
    } else {
      load();
    }
  }, [data.id]);

  const camera = useRef<PerspectiveCamera>(null);
  return (
    <div
      className={`flex flex-col gap-4 h-[28rem] bg-gray-100 rounded-2xl shadow-md relative overflow-hidden hover:bg-gray-50 group cursor-pointer hover:shadow-lg transition-all ${pmodel === data.id
        ? `ring-2 ring-purple-500 hover:ring-4`
        : `hover:ring-2`
        } duration-300`}
      onClick={() => onClick(data)}
    >
      <div className={`w-full h-full`}>
        <Canvas
          frameloop="demand"
          className={`w-full h-full absolute top-0 left-0`}

        >
          <VRMFileRenderer model={model} camera={camera} />
          <ambientLight intensity={1} />
          <PCamera
            makeDefault
            position={[0, 3, 4]}
            zoom={1}
            near={0.1}
            far={1000}
            ref={camera}
          />
        </Canvas>
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent via-gray-200/50 to-gray-200 group-hover:opacity-80 transition-all duration-300`}
      />
      <div
        className={`absolute bottom-0 left-0 w-full h-fit p-4 flex flex-col gap-2`}
      >
        <span className={`text-lg font-bold text-gray-600 font-wsans`}>
          {data.name}
        </span>
        <span
          className={`text-sm text-purple-500 ${pmodel === data.id ? `opacity-100` : `opacity-0`
            } transition-all duration-300 font-bold`}
        >
          Selected
        </span>
      </div>
    </div>
  );
};
