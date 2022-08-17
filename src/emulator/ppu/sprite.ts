import { Color, Palette, PaletteType } from "./palette";
import { Tile } from "./tile";

type SpriteFlags = {
  bgAndWindowOver: boolean;
  yFlip: boolean;
  xFlip: boolean;
  palette: PaletteType;
};

export class Sprite {
  constructor(
    public tile: Tile,
    public x: number,
    public y: number,
    public spriteFlags: SpriteFlags,
    private palette: Palette
  ) {}

  getPixel(x: number, y: number): Color {
    const normalizedX = this.spriteFlags.xFlip ? 7 - x : x;
    const normalizedY = this.spriteFlags.yFlip ? 7 - y : y;
    return this.tile.getPixel(normalizedX, normalizedY, this.palette).color;
  }

  static fromBytes(
    data: Uint8Array,
    tile: Tile,
    object0Palette: Palette,
    object1Palette: Palette
  ) {
    const y = data[0];
    const x = data[1];
    const flags = data[3];
    const spriteFlags = spriteFlagsFromByte(flags);

    const palette =
      spriteFlags.palette === PaletteType.Object0
        ? object0Palette
        : object1Palette;

    return new Sprite(tile, x, y, spriteFlags, palette);
  }
}

function spriteFlagsFromByte(byte: number): SpriteFlags {
  return {
    bgAndWindowOver: (byte & 0x80) !== 0,
    yFlip: (byte & 0x40) !== 0,
    xFlip: (byte & 0x20) !== 0,
    palette: (byte & 0x10) === 0 ? PaletteType.Object0 : PaletteType.Object1,
  };
}
