import React from "react";
import { useEffect, useRef } from "react";
import { StreamMerger } from "../utils/classes/StreamMerger";

export const ScreenFeed = ({ enable, onError }: { enable: boolean, onError: (e) => void }) => {
  const camRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!enable) return;
    let stream = (async () => {
      if (!camRef.current || !globalThis.navigator) {
        console.error("No navigator");
        return;
      }
      let captureStream: MediaStream | null = null;

      try {
        captureStream = await navigator.mediaDevices?.getDisplayMedia({
          audio: true,
          video: true,
        });
      } catch (err) {
        captureStream = null;
        console.error(`Error: ${err}`);
        onError(err);
      }
      //   const mediaRecorder = new MediaRecorder(captureStream);
      //   mediaRecorder.start();
      if (captureStream) {
        camRef.current.srcObject = captureStream;
        StreamMerger.getInstance().setScreenStream(captureStream!);
      }
      return captureStream;
    })() as Promise<MediaStream | null>;
    return () => {
      // stop stream
      stream.then((s) => s?.getTracks().forEach((t) => t.stop()));
    };
  }, [camRef, enable, onError]);

  if (!enable) return <></>

  return (
    <video
      className="input_video w-full h-full"
      ref={camRef}
      //   width="4096px"
      //   height="1920px"
      autoPlay
      muted
      playsInline
    />
  );
};
