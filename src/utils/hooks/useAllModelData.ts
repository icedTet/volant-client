import { useEffect, useState } from "react";
import { ModelData, VRMLoader } from "../classes/VRMLoader";

export const useAllModelData = () => {
  const [modelMap, setModelMap] = useState(
    null as null | Map<string, ModelData>
  );
  useEffect(() => {
    const onReady = () => {
      setModelMap(new Map(VRMLoader.getInstance().getModels()));
      console.log("useAllModelData", modelMap);
    };
    if (VRMLoader.getInstance().ready) {
      onReady();
    }
    VRMLoader.getInstance().on("ready", onReady);
    VRMLoader.getInstance().on("modelDataAdded", onReady);
    return () => {
      VRMLoader.getInstance().off("ready", onReady);
    };
  }, []);
  return modelMap;
};
