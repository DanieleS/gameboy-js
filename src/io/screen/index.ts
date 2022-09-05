import { Color } from "../../emulator/ppu/palette";
import { renderFrame2d } from "./renderer-2d";
import { setupWebgl2Renderer } from "./renderer-webgl2";

export function createRenderFrameHandler(): (buffer: Color[]) => void {
  const screen = document.querySelector<HTMLCanvasElement>("#screenCanvas");
  const ctx = screen?.getContext("webgl2") ?? screen?.getContext("2d");
  if (!ctx) {
    throw new Error("Invalid rendering context");
  }

  if (ctx instanceof CanvasRenderingContext2D) {
    return (buffer: Color[]) => renderFrame2d(ctx, buffer);
  }

  return setupWebgl2Renderer(ctx);
}
