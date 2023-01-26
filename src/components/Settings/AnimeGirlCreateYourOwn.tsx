import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export const AnimeGirlCreateYourOwn = ({ onClick }: { onClick: () => void }) => {
  // add an onclick
  // open a hidden file input
  // when file input changes, open modal,
  //in modal have text box for name, and id.
  // confirm button;
  // save shit to localforage so that VRMLoader can fetch it (look in the code and figure it out)
  return (
    <div
      className={`h-[28rem] border-dashed border-4 border-gray-900/20 rounded-2xl flex flex-col gap-4 items-center justify-center p-4`}
      onClick={onClick}>
      <div className={`w-20 h-20 rounded-full bg-gray-900/20 p-2`}>
        <PlusIcon className={`w-full h-full text-gray-900/50`} />
      </div>
      <h1 className={`text-lg text-gray-500`}>Upload model</h1>
    </div>
  );
};
