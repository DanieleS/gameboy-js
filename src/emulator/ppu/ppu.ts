import { Interrupt, requestInterrupt } from "../cpu/interrupts";
import { wrappingAdd, wrappingSub } from "../cpu/math";
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

    for (let i = 0; i < 160; i++) {
      const bgShiftedDot = wrappingAdd(i, xScroll);
      const bgTileIndex = bgTileMapRow[Math.floor(bgShiftedDot / 8)];
      const bgTile = bgTilesInLine.get(bgTileIndex)!;

      let bgColor = bgTile.getPixel(
        bgShiftedDot % 8,
        bgShiftedScanline % 8,
        bgWindowPalette
      );

      this.buffer[i + this.scanline * 160] = bgColor.color;
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
}
