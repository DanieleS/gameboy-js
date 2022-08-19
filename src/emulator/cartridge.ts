import { createMbc, Mbc, mbcAddress } from "./cartridge/mbc";
import { Memory } from "./memory/memory";

export class Cartridge implements Memory {
  private mbc: Mbc;

  constructor(rom: Uint8Array) {
    const mbcCode = rom[mbcAddress];
    this.mbc = createMbc(mbcCode, rom);
  }

  read(address: number): number {
    return this.mbc.read(address);
  }

  write(address: number, value: number): void {
    this.mbc.write(address, value);
  }
}
