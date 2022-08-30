import { renderFrame } from "../io/screen";
import { EventDataByType, EventEmitter } from "../utils/event-emitter";
import { Cartridge } from "./cartridge";
import { CPU } from "./cpu/cpu";
import { EmulatorEvent } from "./events";
import { Joypad, JoypadButton } from "./joypad";
import { MemoryBus } from "./memory/memory-bus";
import { PPU } from "./ppu/ppu";
import { Timer } from "./timer";

export class Emulator {
  private cartridge: Cartridge;
  private memoryBus: MemoryBus;
  private cpu: CPU;
  private ppu: PPU;
  private joypad: Joypad;
  private timer: Timer;
  private eventEmitter = new EventEmitter<EmulatorEvent>();

  constructor(rom: Uint8Array) {
    this.cartridge = new Cartridge(rom, this.eventEmitter);

    this.memoryBus = new MemoryBus(this.cartridge);
    this.cpu = new CPU();
    this.ppu = new PPU();
    this.joypad = new Joypad();
    this.timer = new Timer();
  }

  public async start(): Promise<void> {
    await this.cartridge.loadSaveFile();

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

      this.eventEmitter.emit("vsync", this.ppu.buffer);

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

  public addEventListener<T extends EmulatorEvent["type"]>(
    type: T,
    handler: (...args: EventDataByType<EmulatorEvent, T>) => void
  ) {
    this.eventEmitter.addEventListener(type, handler);
  }

  public removeEventListener<T extends EmulatorEvent["type"]>(
    type: T,
    handler: (...args: EventDataByType<EmulatorEvent, T>) => void
  ) {
    this.eventEmitter.removeEventListener(type, handler);
  }
}
