import { Interrupt, requestInterrupt } from "../cpu/interrupts";
import {
  contains,
  positiveModulo,
  wrappingAdd,
  wrappingSub,
} from "../cpu/math";
import { Memory } from "../memory/memory";
import { readBytes } from "../memory/utils";
import {
  lcdControlFromMemory,
  LcdStat,
  lcdStatAddress,
  lcdStatFromMemory,
  lcdStatToByte,
} from "./lcd";
import { Color, getPalette, PaletteType } from "./palette";
import { Sprite } from "./sprite";
import { Tile } from "./tile";
import { PpuMode } from "./types";

const lyAddress = 0xff44;
const lycAddress = 0xff45;

const scyAddress = 0xff42;
const scxAddress = 0xff43;
const wyAddress = 0xff4a;
const wxAddress = 0xff4b;

export class PPU {
  public mode: PpuMode = PpuMode.HBlank;
  public scanline: number = 0;
  public dots: number = 0;
  public buffer: Color[] = Array(160 * 144).fill(Color.White);
  public tileMap: Color[] = Array(256 ** 2).fill(Color.White);

  public executeStep(memory: Memory): boolean {
    const lcdStat = lcdStatFromMemory(memory);

    if (lcdStat.lycEqLy && lcdStat.lycEqLyInterruptSource) {
      requestInterrupt(memory, Interrupt.LCDStat);
    }

    switch (this.mode) {
      case PpuMode.HBlank:
        return this.handleHblank(memory, lcdStat);
      case PpuMode.VBlank:
        return this.handleVblank(memory, lcdStat);
      case PpuMode.OamSearch:
        return this.handleOamSearch();
      case PpuMode.PixelTransfer:
        return this.handlePixelTransfer(memory, lcdStat);
    }
  }

  public updateMemory(memory: Memory) {
    memory.write(lyAddress, this.scanline);
    memory.write(lcdStatAddress, this.createStatByte(memory));
  }

  public resetBuffer() {
    this.buffer = Array(160 * 144).fill(Color.White);
  }

  private createStatByte(memory: Memory): number {
    const lcdStat = lcdStatFromMemory(memory);
    const lyc = memory.read(lycAddress);
    lcdStat.lycEqLy = this.scanline == lyc;
    lcdStat.mode = this.mode;

    return lcdStatToByte(lcdStat);
  }

  private handleHblank(memory: Memory, lcdStat: LcdStat): boolean {
    if (this.dots === 456) {
      this.scanline++;
      this.dots = 0;
      if (this.scanline === 143) {
        this.mode = PpuMode.VBlank;
        requestInterrupt(memory, Interrupt.VBlank);
        if (lcdStat.mode1InterruptSource) {
          requestInterrupt(memory, Interrupt.LCDStat);
        }
        return true;
      } else {
        this.mode = PpuMode.OamSearch;
        if (lcdStat.mode2InterruptSource) {
          requestInterrupt(memory, Interrupt.LCDStat);
        }
        return false;
      }
    } else {
      this.dots++;
      return false;
    }
  }

  private handleVblank(memory: Memory, lcdStat: LcdStat): boolean {
    if (this.dots == 456) {
      this.scanline += 1;
      this.dots = 0;
      if (this.scanline == 154) {
        this.scanline = 0;
        this.mode = PpuMode.OamSearch;
        if (lcdStat.mode2InterruptSource) {
          requestInterrupt(memory, Interrupt.LCDStat);
        }
      }
    } else {
      this.dots += 1;
    }
    return false;
  }

  private handleOamSearch(): boolean {
    if (this.dots == 80) {
      this.mode = PpuMode.PixelTransfer;
    } else {
      this.dots += 1;
    }
    return false;
  }

  private handlePixelTransfer(memory: Memory, lcdStat: LcdStat): boolean {
    if (this.dots == 240) {
      this.renderLine(memory);
      this.mode = PpuMode.HBlank;
      if (lcdStat.mode0InterruptSource) {
        requestInterrupt(memory, Interrupt.LCDStat);
      }
    } else {
      this.dots += 1;
    }
    return false;
  }

  private renderLine(memory: Memory) {
    const lcdControl = lcdControlFromMemory(memory);

    if (!lcdControl.enabled) {
      return;
    }

    const xScroll = memory.read(scxAddress);
    const yScroll = memory.read(scyAddress);
    const windowX = memory.read(wxAddress);
    const windowY = memory.read(wyAddress);

    const bgShiftedScanline = wrappingAdd(this.scanline, yScroll);

    const bgWindowPalette = getPalette(memory, PaletteType.Background);

    const bgTileMapArea = lcdControl.backgroundTileMapArea;
    const bgTileMapRow = readBytes(
      memory,
      bgTileMapArea + 32 * Math.floor(bgShiftedScanline / 8),
      32
    );
    const bgTilesInLine = this.getBgTilesInRow(memory, bgTileMapRow);

    const [windowTileMapRow, windowTilesInLine] =
      this.getWindowTilesInformations(memory);

    const spritesInRow = this.getSpriteTilesInRow(memory);

    for (let i = 0; i < 160; i++) {
      const bgShiftedDot = wrappingAdd(i, xScroll);
      const bgTileIndex = bgTileMapRow[Math.floor(bgShiftedDot / 8)];
      const bgTile = bgTilesInLine.get(bgTileIndex)!;

      let bgColor = bgTile.getPixel(
        bgShiftedDot % 8,
        bgShiftedScanline % 8,
        bgWindowPalette
      );

      if (
        lcdControl.windowEnabled &&
        this.scanline >= windowY &&
        i + 7 >= windowX
      ) {
        const windowShiftedDot = wrappingSub(wrappingAdd(i, 7), windowX);
        const windowTileId = windowTileMapRow[Math.floor(windowShiftedDot / 8)];
        const windowTile = windowTilesInLine.get(windowTileId)!;
        const windowColor = windowTile.getPixel(
          positiveModulo(windowShiftedDot, 8),
          positiveModulo(this.scanline - windowY, 8),
          bgWindowPalette
        );

        bgColor = windowColor;
      }

      const spriteColor = spritesInRow
        .filter((sprite) => contains(sprite.x, sprite.x + 8, i + 8))
        .map(
          (sprite) =>
            [
              sprite,
              sprite.getPixel(
                positiveModulo(i - positiveModulo(sprite.x, 8), 8),
                positiveModulo(this.scanline - positiveModulo(sprite.y, 8), 8)
              ),
            ] as const
        )
        .find(([, color]) => color !== Color.Transparent);

      this.buffer[i + this.scanline * 160] = spriteColor
        ? spriteColor[0].spriteFlags.bgAndWindowOver && bgColor.priority
          ? bgColor.color
          : spriteColor[1]
        : bgColor.color;
    }
  }

  private getBgTilesInRow(memory: Memory, bgTileMapRow: Uint8Array) {
    const lcdControl = lcdControlFromMemory(memory);

    const deduplicatedTiles = [...new Set(bgTileMapRow)];

    return new Map(
      deduplicatedTiles.map((tileIndex) => {
        const tile = Tile.fromMemory(
          memory,
          lcdControl.backgroundWindowTileDataArea(tileIndex)
        );

        return [tileIndex, tile];
      })
    );
  }

  private getWindowTilesInformations(
    memory: Memory
  ): [Uint8Array, Map<number, Tile>] {
    const lcdControl = lcdControlFromMemory(memory);
    const windowY = memory.read(wyAddress);
    const palette = getPalette(memory, PaletteType.Background);

    const windowTileMapArea = lcdControl.windowTileMapArea;

    if (!lcdControl.windowEnabled || this.scanline < windowY) {
      return [new Uint8Array(), new Map()];
    }

    const windowTileMapRow = readBytes(
      memory,
      windowTileMapArea + 32 * Math.floor((this.scanline - windowY) / 8),
      32
    );

    const windowTilesInRow = this.getBgTilesInRow(memory, windowTileMapRow);

    return [windowTileMapRow, windowTilesInRow];
  }

  private getSpriteTilesInRow(memory: Memory) {
    const lcdControl = lcdControlFromMemory(memory);

    if (!lcdControl.objectEnable) {
      return [];
    }

    const sprites = this.getSprites(memory);
    const rowSprites = [];

    for (const sprite of sprites) {
      if (contains(sprite.y, sprite.y + 8, this.scanline + 16)) {
        rowSprites.push(sprite);
      }
    }

    rowSprites.sort((a, b) => b.x - a.x);

    return rowSprites;
  }

  private getSprites(memory: Memory) {
    const sprites = [];
    const obp0 = getPalette(memory, PaletteType.Object0);
    const obp1 = getPalette(memory, PaletteType.Object1);

    for (let i = 0xfe00; i < 0xfea0; i += 4) {
      const spriteData = readBytes(memory, i, 4);
      const tile = Tile.fromMemory(memory, 0x8000 + spriteData[2] * 16);
      const sprite = Sprite.fromBytes(spriteData, tile, obp0, obp1);
      sprites.push(sprite);
    }

    return sprites;
  }
}
