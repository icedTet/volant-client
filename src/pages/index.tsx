import Link from "next/link"
import { FileUploader } from "react-drag-drop-files";
import React from "react";
import { useState } from "react";
import { AnimeGirlCard } from "../components/Settings/AnimeGirlCard";
import { AnimeGirlCreateYourOwn } from "../components/Settings/AnimeGirlCreateYourOwn";
import { AnimeGirlRenderer } from "../components/Settings/AnimeGirlRender";
import { VRMLoader } from "../utils/classes/VRMLoader";
import { useAllModelData } from "../utils/hooks/useAllModelData";
import { useSelectedModel } from "../utils/hooks/useVRMFile";
import { Modal } from "../components/Modal"

export const HomePage = () => {
  const [streamURL, setStreamURL] = useState("");
  const [key, setKey] = useState("");
  const [streamWidth, setStreamWidth] = useState(1280);
  const [streamHeight, setStreamHeight] = useState(720);
  const [streamFPS, setStreamFPS] = useState(60);
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState(null);


  const handleFileUpload = (file) => {
    setFile(file)

    // TODO set up and do image canvas stuff localforge
  }

  const model = useSelectedModel();
  const modelMap = useAllModelData();
  return (
    <div id="top" className={`grid grid-cols-10 gap-2 w-full min-h-screen`}>
      <div className={`col-span-5 bg-black p-16 max-h-screen overflow-auto`}>
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <h1
              className={`text-6xl font-bold text-cyan-300`}
            >
              Volant
            </h1>
            <Link href="/live" className={`py-2 px-3 text-xl font-semibold bg-gray-800 rounded-2xl hover:bg-gray-700`}>Go Live</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h2
              className={`text-base font-semibold`}
            >
              Stream Connection Settings
            </h2>
            <div className={`flex flex-col gap-4 w-full`}>
              <input
                type={"text"}
                placeholder="Streaming URL (rtmp://a.rtmp.youtube.com/live2, rtmp://XYZ.contribute.live-video.net/app)"
                className="basicinput"
                value={streamURL}
                onChange={(e) => setStreamURL(e.target.value)}
              />
              <input
                type={"text"}
                placeholder="Stream Key (xxxx-xxxx-xxxx-xxxx-xxxx)"
                className="basicinput"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <h3
              className={`text-base font-semibold`}
            >
              Stream Quality Settings
            </h3>
            <div className={`flex flex-row gap-4 items-center`}>
              <input
                type={"number"}
                placeholder="Stream Width"
                className="basicinput"
                value={streamWidth}
                onChange={(e) => setStreamWidth(e.target.value as any)}
              />
              <span>×</span>
              <input
                type={"number"}
                placeholder="Stream Height"
                className="basicinput"
                value={streamHeight}
                onChange={(e) => setStreamHeight(e.target.value as any)}
              />
              <span>at</span>
              <input
                type={"number"}
                placeholder="Stream FPS"
                className="basicinput"
                value={streamFPS}
                onChange={(e) => setStreamFPS(e.target.value as any)}
              />
              <span>fps</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2
              className={`text-base font-semibold`}
            >
              Model Settings
            </h2>
            <div className={`grid grid-cols-2 lg:grid-cols-3  gap-4 w-full`}>
              {Array.from(modelMap?.keys() || []).map((key) => (
                <AnimeGirlCard
                  key={`anime-card-${key}`}
                  data={VRMLoader.getInstance().modelDataMap.get(key)!}
                  onClick={(model) => {
                    VRMLoader.getInstance().setPrimaryModel(model.id);
                  }}
                />
              ))}
              <AnimeGirlCreateYourOwn onClick={() => setModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>
      <div className={`col-span-5`}>
        <AnimeGirlRenderer model={model} />
      </div>
      <Modal onClose={() => setModalOpen(false)} title="Add New VRM Character" visible={modalOpen} >
        <div className="my-16 mx-24 flex flex-col items-center justify-center">
          <FileUploader handleChange={handleFileUpload} name="file" types={['.vrm']} />
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
