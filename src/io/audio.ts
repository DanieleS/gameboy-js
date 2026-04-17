import { SAMPLE_RATE } from "../emulator/apu/apu";

export function createAudioHandler(): (buffer: Float32Array) => void {
  const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
  let nextPlayTime = 0;

  return (buffer: Float32Array) => {
    if (ctx.state === "suspended") ctx.resume();

    const frameCount = buffer.length / 2;
    const audioBuffer = ctx.createBuffer(2, frameCount, SAMPLE_RATE);

    const left = audioBuffer.getChannelData(0);
    const right = audioBuffer.getChannelData(1);
    for (let i = 0; i < frameCount; i++) {
      left[i] = buffer[i * 2];
      right[i] = buffer[i * 2 + 1];
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const startTime = Math.max(ctx.currentTime + 0.005, nextPlayTime);
    source.start(startTime);
    nextPlayTime = startTime + audioBuffer.duration;
  };
}
