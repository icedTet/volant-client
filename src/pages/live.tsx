import React, { useState, useEffect } from "react";
import { CameraFeed } from "../components/CameraFeed";
import { ScreenFeed } from "../components/ScreenFeed";
import { WeebFeed } from "../components/WeebFeed";
import { MicrophoneStreamer } from "../utils/classes/AudioManager";
import SocketConnection from "../utils/classes/SocketStreamer";
import { StreamMerger } from "../utils/classes/StreamMerger";
import {
  ComputerDesktopIcon,
  PauseIcon,
  Cog6ToothIcon,
  MicrophoneIcon,
  ArrowsUpDownIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export const LivePage = () => {
  const [recording, setRecording] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const [switchFeed, setSwitchFeed] = useState(false);

  useEffect(() => {
    if (enableAudio) {
      MicrophoneStreamer.getInstance().getMicrophoneAccess();
    }
  }, [enableAudio]);

  useEffect(() => {
    StreamMerger.getInstance().toggleLargeStream(switchFeed);
  }, [switchFeed]);

  const toggleRecording = () => {
    setRecording((r) => !r);
  };

  const toggleAudio = () => {
    setEnableAudio((a) => !a);
  };

  const toggleFeed = () => {
    setSwitchFeed((s) => !s);
  };

  const playButton = () => {
    StreamMerger.getInstance().renderStream();
    SocketConnection.getInstance().startStream();
  };

  return (
    <div className={`w-screen h-screen relative`}>
      <div className={`absolute top-0 left-0 w-full h-full z-0`}>
        {!switchFeed ? (
          <ScreenFeed enable={recording} onError={(e) => setRecording(false)} />
        ) : (
          <WeebFeed large />
        )}
      </div>
      <div
        className={`absolute bottom-4 right-4 w-96 h-72 z-10 rounded-2xl shadow-md overflow-hidden`}
      >
        <CameraFeed />
      </div>
      <div
        className={`absolute bottom-80 right-4 w-96 h-72 z-10 rounded-2xl shadow-md overflow-hidden`}
      >
        {switchFeed ? (
          <ScreenFeed enable={recording} onError={(e) => setRecording(false)} />
        ) : (
          <WeebFeed />
        )}
      </div>
      <div className="fixed left-0 p-3 m-3 top-16 flex flex-col w-16 bg-gray-300 rounded-lg space-y-5">
        <button
          onClick={toggleRecording}
          className="hover:bg-gray-400 p-1 rounded-lg"
        >
          {!recording ? <ComputerDesktopIcon /> : <PauseIcon />}
        </button>
        <button
          onClick={toggleFeed}
          className="hover:bg-gray-400 p-1 rounded-lg"
        >
          <ArrowsUpDownIcon />
        </button>
        <Link href="/" className="hover:bg-gray-400 p-1 rounded-lg">
          {<Cog6ToothIcon />}
        </Link>
        {!enableAudio && (
          <button
            onClick={toggleAudio}
            className="hover:bg-gray-400 p-1 rounded-lg"
          >
            {<MicrophoneIcon />}
          </button>
        )}
        <button
          onClick={playButton}
          className="hover:bg-gray-400 p-1 rounded-lg"
        >
          <PlayIcon />
        </button>
      </div>
    </div>
  );
};

export default LivePage;
