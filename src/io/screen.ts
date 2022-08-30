import { Color } from "../emulator/ppu/palette";

const screen = document.querySelector<HTMLCanvasElement>("#screenCanvas");
const screenCtx = screen?.getContext("2d");

const palette = ["#758534", "#4E5923", "#272C11", "#000000"];

export function renderFrame(buffer: Color[]) {
  if (!screenCtx) {
    throw new Error("screenCanvas not found");
  }

  screenCtx.fillStyle = palette[0];
  screenCtx.fillRect(0, 0, 160, 144);
  for (let i = 0; i < buffer.length; i++) {
    const x = i % 160;
    const y = Math.floor(i / 160);

    if (buffer[i] > 0) {
      screenCtx.fillStyle = palette[buffer[i]];
      screenCtx.fillRect(x, y, 1, 1);
    }
  }
}
