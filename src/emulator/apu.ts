import { EventEmitter } from "../utils/event-emitter";
import { EmulatorEvent } from "./events";

export class APU {
  private eventEmitter: EventEmitter<EmulatorEvent>;
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private noiseBuffer: AudioBuffer;
  private noiseSource: AudioBufferSourceNode | null = null;

  constructor(eventEmitter: EventEmitter<EmulatorEvent>) {
    this.eventEmitter = eventEmitter;
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.noiseBuffer = this.createNoiseBuffer();
  }

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  public playAudio() {
    if (this.noiseSource) {
      this.noiseSource.stop();
    }

    this.noiseSource = this.audioContext.createBufferSource();
    this.noiseSource.buffer = this.noiseBuffer;
    this.noiseSource.loop = true;
    this.noiseSource.connect(this.gainNode);
    this.noiseSource.start();

    // Emit playAudio event
    this.eventEmitter.emit("playAudio");
  }
}
