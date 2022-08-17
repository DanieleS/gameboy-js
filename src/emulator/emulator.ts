import { renderFrame } from "../screen";
import { Cartridge } from "./cartridge";
import { CPU } from "./cpu/cpu";
import { Joypad, JoypadButton } from "./joypad";
import { MemoryBus } from "./memory/memory-bus";
import { PPU } from "./ppu/ppu";
import { Timer } from "./timer";

export class Emulator {
  private memoryBus: MemoryBus;
  private cpu: CPU;
  private ppu: PPU;
  private joypad: Joypad;
  private timer: Timer;

  constructor(rom: Uint8Array) {
    const cartdige = new Cartridge(rom);

    this.memoryBus = new MemoryBus(cartdige);
    this.cpu = new CPU();
    this.ppu = new PPU();
    this.joypad = new Joypad();
    this.timer = new Timer();
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
        this.joypad.updateMemory(this.memoryBus);

        this.timer.tick(elapsedCycles, this.memoryBus);

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

  public sendJoypadButtonDown(input: JoypadButton) {
    this.joypad.setKeyDown(input);
  }

  public sendJoypadButtonUp(input: JoypadButton) {
    this.joypad.setKeyUp(input);
  }
}
