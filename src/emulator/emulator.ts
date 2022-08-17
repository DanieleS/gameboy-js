import { renderFrame } from "../screen";
import { Cartridge } from "./cartridge";
import { CPU } from "./cpu/cpu";
import { MemoryBus } from "./memory/memory-bus";
import { PPU } from "./ppu/ppu";

export class Emulator {
  private memoryBus: MemoryBus;
  private cpu: CPU;
  private ppu: PPU;

  constructor(rom: Uint8Array) {
    const cartdige = new Cartridge(rom);

    this.memoryBus = new MemoryBus(cartdige);
    this.cpu = new CPU();
    this.ppu = new PPU();
  }

  public start(): void {
    const executeFrame = () => {
      while (true) {
        const [elapsedCycles] = this.cpu.executeStep(this.memoryBus);

        let vsync = false;
        for (let i = 0; i < elapsedCycles; i++) {
          vsync ||= this.ppu.executeStep(this.memoryBus);
        }

        this.ppu.updateMemory(this.memoryBus);

        if (vsync) {
          break;
        }
      }

      renderFrame(this.ppu.buffer);

      this.ppu.resetBuffer();

      requestAnimationFrame(executeFrame);
    };

    requestAnimationFrame(executeFrame);
  }
}
