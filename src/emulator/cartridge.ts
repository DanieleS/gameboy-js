import { Memory } from "./memory/memory";

export class Cartridge implements Memory {
  constructor(private rom: Uint8Array) {}

  read(address: number): number {
    return this.rom[address];
  }

  write(address: number, value: number): void {
    //
  }
}
