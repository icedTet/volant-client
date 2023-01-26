import { EventEmitter } from "events";
import { VideoStreamMerger } from "video-stream-merger";
import SocketConnection from "./SocketStreamer";

export class StreamMerger extends EventEmitter {
  static instance: StreamMerger;
  static getInstance(): StreamMerger {
    if (!StreamMerger.instance) {
      StreamMerger.instance = new StreamMerger();
    }
    return StreamMerger.instance;
  }
  videoStream?: MediaStream;
  screenStream?: MediaStream;
  audioStream?: MediaStream;
  merger?: VideoStreamMerger;
  width: number;
  height: number;
  fps: number;
  largeStream?: boolean;
  private constructor() {
    super();
    this.width = 1920;
    this.height = 1080;
    this.fps = 30;
  }
  setStreamResolution(width?: number, height?: number, fps?: number) {
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    this.fps = fps ?? this.fps;
  }
  setVideoStream(stream: MediaStream) {
    this.videoStream = stream;
    this.emit("videoStream", stream);
    console.log(stream);
    // if (this.merger) {
    //   this.merger.stop();
    //   this.renderStream();
    // }

  }
  setScreenStream(stream: MediaStream) {
    this.screenStream = stream;
    this.emit("screenStream", stream);
    console.log(stream);
    // if (this.merger) {
    //   this.merger.stop();
    //   this.renderStream();
    // }
  }
  setAudioStream(stream: MediaStream) {
    this.audioStream = stream;
    this.emit("audioStream", stream);
    // if (this.merger) {
    //   this.merger.stop();
    //   this.renderStream();
    // }
  }
  toggleLargeStream(enable: boolean) {
    this.largeStream = enable;
    // if (this.merger) {
    //   this.merger.stop();
    //   this.renderStream();
    // }
  }

  renderStream() {
    // if (!this.videoStream || !this.screenStream) {
    //   return;
    // }
    this.merger = new VideoStreamMerger({
      width: this.width,
      height: this.height,
      fps: this.fps,
      clearRect: false,
      audioContext: null as any,
    });
    if (this.largeStream) {
      this.videoStream &&
        this.merger.addStream(this.videoStream, {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          mute: false,
        } as any);
    } else {
      this.screenStream &&
        this.merger.addStream(this.screenStream, {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          mute: false,
        } as any);
      this.videoStream &&
        this.merger.addStream(this.videoStream, {
          x: (this.width * 3) / 4,
          y: (this.width * 0.4375) / 4,
          width: this.width / 4,
          height: (this.width * 0.5625) / 4,
          mute: false,
        } as any);
    }

    this.audioStream && this.merger.addStream(this.audioStream, undefined);
    this.emit("renderStream", this.merger.result);
    this.merger.start();
    SocketConnection.getInstance().setMediaStream(this.merger.result!);

    // this.merger = new SimpleStreamMerger({
    //   width: this.width,
    //   height: this.height,
    //   fps: this.fps,
    // });
    // this.merger.addStream(this.screenStream, {
    //   x: 0,
    //   y: 0,
    //   width: this.width,
    //   height: this.height,
    // });
    // this.merger.addStream(this.videoStream, {
    //   x: 0,
    //   y: 0,
    //   width: this.videoStream,
    //   height: this.height,
    // });
    // this.emit("renderStream", this.merger.result);
  }
}
