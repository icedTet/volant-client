import EventEmitter from "events";
import { io, Socket as SocketIOClient } from "socket.io-client";

export class SocketConnection extends EventEmitter {
  static instance: SocketConnection;
  static getInstance(): SocketConnection {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }
  private socket: SocketIOClient;
  private mediaStream?: MediaStream;
  private mediaRecorder?: MediaRecorder;
  private streaming?: boolean;
  constructor() {
    super();
    this.socket = io("http://localhost:443", { transports: ["websocket"] });
  }
  setMediaStream(stream: MediaStream) {
    this.mediaStream = stream;
    this.emit("mediaStream", stream);
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = undefined;
    }
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: "video/webm",
      videoBitsPerSecond: 6000000,
    });
    console.log(this.mediaStream);

    this.mediaRecorder.ondataavailable = this.onStreamData.bind(this);

    this.mediaRecorder.start(100);
  }
  public onStreamData(e: BlobEvent) {
    if (!this.streaming) return;
    this.socket.emit("message", e.data);
  }
  public startStream() {
    this.streaming = true;
    if (this.mediaRecorder?.state !== "recording") {
      this.mediaRecorder?.start(0);
    }
    return this.socket;
  }
  public stopStream() {
    this.streaming = false;
    this.mediaRecorder?.stop();
    return this.socket;
  }
}

export default SocketConnection;
