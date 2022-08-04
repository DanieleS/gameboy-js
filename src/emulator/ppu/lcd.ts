import { unsignedToSignedByte } from "../cpu/math";
import { Memory } from "../memory/memory";
import { PpuMode } from "./types";

export const lcdStatAddress = 0xff41;
export const lcdControlAddress = 0xff40;

export type LcdStat = {
  lycEqLyInterruptSource: boolean;
  mode2InterruptSource: boolean;
  mode1InterruptSource: boolean;
  mode0InterruptSource: boolean;
  lycEqLy: boolean;
  mode: PpuMode;
};

export function lcdStatFromMemory(memory: Memory): LcdStat {
  const byte = memory.read(lcdStatAddress);
  return {
    lycEqLyInterruptSource: (byte & 0x40) !== 0,
    mode2InterruptSource: (byte & 0x20) !== 0,
    mode1InterruptSource: (byte & 0x10) !== 0,
    mode0InterruptSource: (byte & 0x80) !== 0,
    lycEqLy: (byte & 0x04) !== 0,
    mode: byte & 0b11,
  };
}

export function lcdStatToByte(lcdStat: LcdStat): number {
  let byte = 0;
  if (lcdStat.lycEqLyInterruptSource) {
    byte |= 0x40;
  }
  if (lcdStat.mode2InterruptSource) {
    byte |= 0x20;
  }
  if (lcdStat.mode1InterruptSource) {
    byte |= 0x10;
  }
  if (lcdStat.mode0InterruptSource) {
    byte |= 0x80;
  }
  if (lcdStat.lycEqLy) {
    byte |= 0x04;
  }
  byte |= lcdStat.mode;
  return byte;
}

export type ObjectSize = "8x8" | "8x16";

export type LcdControl = {
  enabled: boolean;
  windowTileMapArea: 0x9800 | 0x9c00;
  windowEnabled: boolean;
  backgroundWindowTileDataArea: (tileIndex: number) => number;
  backgroundTileMapArea: 0x9800 | 0x9c00;
  objectSize: ObjectSize;
  objectEnable: boolean;
  backgroundEnable: boolean;
};

export function lcdControlFromMemory(memory: Memory): LcdControl {
  const byte = memory.read(lcdControlAddress);
  return {
    enabled: (byte & 0x80) !== 0,
    windowTileMapArea: (byte & 0x40) !== 0 ? 0x9c00 : 0x9800,
    windowEnabled: (byte & 0x20) !== 0,
    backgroundWindowTileDataArea:
      (byte & 0x10) !== 0
        ? getBackgroundTileDataAreaUnsigned
        : getBackgroundTileDataAreaSigned,
    backgroundTileMapArea: (byte & 0x08) !== 0 ? 0x9c00 : 0x9800,
    objectSize: (byte & 0x04) !== 0 ? "8x16" : "8x8",
    objectEnable: (byte & 0x02) !== 0,
    backgroundEnable: (byte & 0x01) !== 0,
  };
}

function getBackgroundTileDataAreaUnsigned(tileIndex: number): number {
  return 0x8000 + tileIndex * 16;
}

function getBackgroundTileDataAreaSigned(tileIndex: number): number {
  return 0x9000 + unsignedToSignedByte(tileIndex) * 16;
}
