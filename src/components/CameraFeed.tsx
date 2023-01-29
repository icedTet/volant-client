import React, { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import {
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
} from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { FaceAI } from "../utils/classes/FaceAI";

export const CameraFeed = () => {
  const input_video = useRef<HTMLVideoElement>(null);
  const guides = useRef<HTMLCanvasElement>(null);
  const random = useRef(0);
  useEffect(() => {
    const videoElement = input_video.current!;
    let rando = ~~(Math.random() * 1000000000);
    random.current = parseInt(`${rando}`);
    const drawResults = (results) => {
      const guideCanvas = guides.current!;

      guideCanvas.width = videoElement.videoWidth;
      guideCanvas.height = videoElement.videoHeight;
      let canvasCtx = guideCanvas.getContext("2d")!;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
      // Use `Mediapipe` drawing functions
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00cff7",
        lineWidth: 4,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#ff0364",
        lineWidth: 2,
      });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      });
      if (results.faceLandmarks && results.faceLandmarks.length === 478) {
        //draw pupils
        drawLandmarks(
          canvasCtx,
          [results.faceLandmarks[468], results.faceLandmarks[468 + 5]],
          {
            color: "#ffe603",
            lineWidth: 2,
          }
        );
      }
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "#eb1064",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: "#00cff7",
        lineWidth: 2,
      });
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "#22c3e3",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#ff0364",
        lineWidth: 2,
      });
    };

    let cam = new Camera(videoElement, {
      onFrame: async () => {
        if (rando !== random.current) return;
        const perf = performance.now();
        FaceAI.getInstance().send({ image: videoElement });
      },
      width: 1280,
      height: 960
    });
    cam.start();
    FaceAI.getInstance().on("results", drawResults);

    return () => {
      cam.stop();
      // cam
      FaceAI.getInstance().off("results", drawResults);
    };
  }, []);

  return (
    <div className={`-scale-x-100 w-auto h-full relative`}>
      <video
        ref={input_video}
        autoPlay
        muted
        playsInline
        className={`w-full h-full absolute top-0 left-0`}
        id="input_video"
      ></video>
      <canvas
        ref={guides}
        className={`w-full h-full absolute top-0 left-0 bg-slate-500`}
      />
    </div>
  );
};
