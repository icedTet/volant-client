import EventEmitter from "events";
import { StreamMerger } from "./StreamMerger";

export class MicrophoneStreamer extends EventEmitter {
  static instance: MicrophoneStreamer;
  static getInstance(): MicrophoneStreamer {
    if (!MicrophoneStreamer.instance) {
      MicrophoneStreamer.instance = new MicrophoneStreamer();
    }
    return MicrophoneStreamer.instance;
  }
  mediaStream?: MediaStream;
  private constructor() {
    super();
  }
  async getMicrophoneAccess() {
    const stream = await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .catch((er) => false);
    if (!stream) return false;
    this.mediaStream = stream as MediaStream;
    this.emit("mediaStream", stream);
    console.log(stream, "microphone");
    StreamMerger.getInstance().setAudioStream(stream as MediaStream);
    return true;
  }
}
