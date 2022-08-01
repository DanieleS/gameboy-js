import { Cartridge } from "./cartridge";
import { CPU } from "./cpu/cpu";
import { MemoryBus } from "./memory/memory-bus";

export class Emulator {
  private memoryBus: MemoryBus;
  private cpu: CPU;

  constructor(rom: Uint8Array) {
    const cartdige = new Cartridge(rom);

    this.memoryBus = new MemoryBus(cartdige);
    this.cpu = new CPU();
  }

  public start(): void {
    // TODO
  }
}
