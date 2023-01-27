import { VRM } from "@pixiv/three-vrm";
import { useEffect, useState } from "react";
import { VRMLoader } from "../classes/VRMLoader";

export const useSelectedModel = () => {
  const [model, setModel] = useState(null as null | VRM | undefined); //undefined if not loaded, null if loaded but not set yet

  useEffect(() => {
    if (!globalThis.window) return;
    const onLoaded = async () => {
      const model = VRMLoader.getInstance().getPrimaryModel();
      console.log("useSelectedModel", model);
      if (!model) return;
      const vrm = await model.getVRM();
      setModel(vrm);
    };
    if (!VRMLoader.getInstance().ready) {
      VRMLoader.getInstance().on("ready", onLoaded);
    } else {
      onLoaded();
    }
    VRMLoader.getInstance().on("primaryModelChanged", onLoaded);
    return () => {
      VRMLoader.getInstance().off("ready", onLoaded);
      VRMLoader.getInstance().off("primaryModelChanged", onLoaded);
    };
  }, []);
  console.log("modelupdate", model);
  return model;
};
