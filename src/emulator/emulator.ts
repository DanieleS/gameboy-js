import { Cartridge } from "./cartridge";
import { Memory } from "./memory/memory";
import { MemoryBus } from "./memory/memory-bus";

export class Emulator {
  constructor(rom: Uint8Array) {
    const cartdige = new Cartridge(rom);
  }

  public start(): void {
    // TODO
  }
}
