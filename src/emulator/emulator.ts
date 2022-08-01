import { Cartridge } from "./cartridge";
import { MemoryBus } from "./memory/memory-bus";

export class Emulator {
  private memoryBus: MemoryBus;

  constructor(rom: Uint8Array) {
    const cartdige = new Cartridge(rom);

    this.memoryBus = new MemoryBus(cartdige);
  }

  public start(): void {
    // TODO
  }
}
