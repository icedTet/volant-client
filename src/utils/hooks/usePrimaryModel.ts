import { useEffect, useState } from "react";
import { VRMLoader } from "../classes/VRMLoader";

export const usePrimaryModel = () => {
  const [primaryModelID, setPrimaryModelID] = useState("");
  useEffect(() => {
    const onReady = () => {
      setPrimaryModelID(VRMLoader.getInstance().selectedModel ?? '');
    };
    if (VRMLoader.getInstance().ready) {
      onReady();
    }
    VRMLoader.getInstance().on("ready", onReady);
    VRMLoader.getInstance().on("primaryModelChanged", onReady);
    return () => {
      VRMLoader.getInstance().off("ready", onReady);
      VRMLoader.getInstance().off("primaryModelChanged", onReady);
    };
  }, []);
  return primaryModelID;
};
