import { Memory } from "../memory/memory";

export const enum PaletteType {
  Background = 0xff47,
  Object0 = 0xff48,
  Object1 = 0xff49,
}

export const enum Color {
  Transparent = -1,
  White = 0,
  LightGray = 1,
  DarkGray = 2,
  Black = 3,
}

export type Palette = [Color, Color, Color, Color];

export function getPalette(memory: Memory, type: PaletteType): Palette {
  const value = memory.read(type);
  return [
    type === PaletteType.Background ? value & 0x3 : Color.Transparent,
    (value >> 2) & 0x3,
    (value >> 4) & 0x3,
    (value >> 6) & 0x3,
  ];
}
