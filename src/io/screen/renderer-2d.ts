import { Color } from "../../emulator/ppu/palette";

const palette = ["#758534", "#4E5923", "#272C11", "#000000"];

export function renderFrame2d(
  context: CanvasRenderingContext2D,
  buffer: Color[]
) {
  context.fillStyle = palette[0];
  context.fillRect(0, 0, 160, 144);
  for (let i = 0; i < buffer.length; i++) {
    const x = i % 160;
    const y = Math.floor(i / 160);

    if (buffer[i] > 0) {
      context.fillStyle = palette[buffer[i]];
      context.fillRect(x, y, 1, 1);
    }
  }
}
