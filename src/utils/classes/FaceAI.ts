import { Holistic, InputMap, Results } from "@mediapipe/holistic";
import EventEmitter from "events";

export class FaceAI extends EventEmitter {
  static instance: FaceAI;

  static getInstance(): FaceAI {
    if (!FaceAI.instance) {
      FaceAI.instance = new FaceAI();
    }
    return FaceAI.instance;
  }

  holistic: Holistic;

  ready?: boolean;

  readying?: boolean;

  private constructor() {
    console.log("FaceAI constructor");
    super();
    this.holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });
    this.holistic.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      refineFaceLandmarks: true,
    });
    this.holistic.onResults(this.onResults.bind(this));
    this.init();
  }

  async send(data: InputMap) {
    return this.holistic.send(data);
  }

  onResults(results: Results) {
    this.emit("results", results);
  }

  init() {
    if (this.ready || this.readying) {
      return;
    }
    this.readying = true;
    return this.holistic.initialize().then(() => {
      this.ready = true;
      this.readying = false;
      console.log("FaceAI ready");
    });
  }

  deinit() {
    return this.holistic.close().then(() => {
      this.ready = false;
    });
  }
}
