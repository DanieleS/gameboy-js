import { Cartridge } from "./cartridge";
import { Color } from "./ppu/palette";

export type MBCEvent = {
  type: "save";
  data: [cartridge: Cartridge, ram: Uint8Array];
};

export type PPUEvent = {
  type: "vsync";
  data: [frameBuffer: Color[]];
};

export type APUEvent = {
  type: "playAudio";
  data: [];
};

export type EmulatorEvent = MBCEvent | PPUEvent | APUEvent;
