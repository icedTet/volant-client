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
      // cleanup
    };
    // const clas = new VRMFile(
    //   `https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981`,
    //   "cute anime girl",
    //   "cag"
    // );
    // clas.once("loaded", () => {
    //   console.log("loaded model");
    //   setModel(null);
    //   setModel(clas.model);
    // });
    // clas.getVRM().then((vrm) => {
    //   console.log("loaded vrm");
    //   setModel(vrm);
    // });
  }, []);
  console.log("modelupdate", model);
  return model;
};
