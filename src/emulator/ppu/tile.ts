import { Memory } from "../memory/memory";
import { readBytes } from "../memory/utils";
import { Color, Palette } from "./palette";

export type TilePixel = {
  color: Color;
  priority: boolean;
};

export class Tile {
  constructor(private data: Uint8Array) {}

  static fromMemory(memory: Memory, tileAddress: number): Tile {
    const data = readBytes(memory, tileAddress, 16);

    return new Tile(data);
  }

  public getPixel(x: number, y: number, palette: Palette): TilePixel {
    const normalizedCoordinate = x + y * 8;
    const byteCoord = Math.floor(normalizedCoordinate / 8) * 2;
    const evenByte = this.data[byteCoord];
    const oddByte = this.data[byteCoord + 1];

    const bit = 1 << (7 - x);
    const firstBit = (oddByte & bit) !== 0 ? 1 : 0;
    const secondBit = (evenByte & bit) !== 0 ? 1 : 0;

    return {
      color: palette[(firstBit << 1) | secondBit],
      priority: Boolean(firstBit | secondBit),
    };
  }
}
