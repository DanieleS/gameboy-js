import { EventEmitter } from "../utils/event-emitter";
import { createMbc, Mbc, mbcAddress } from "./cartridge/mbc";
import { EmulatorEvent } from "./events";
import { Memory } from "./memory/memory";
import { readBytes } from "./memory/utils";

export type CartridgeHeader = {
  title: string;
  checksum: number;
};
export class Cartridge implements Memory {
  private mbc: Mbc;

  constructor(rom: Uint8Array, eventEmitter: EventEmitter<EmulatorEvent>) {
    const mbcCode = rom[mbcAddress];
    this.mbc = createMbc(this, mbcCode, rom, eventEmitter);
  }

  get id() {
    return this.header.title + this.header.checksum;
  }

  get header(): CartridgeHeader {
    return {
      title: this.title,
      checksum: this.globalChecksum,
    };
  }

  get title() {
    const titleLength = this.isNew ? 0xb : 0x8;
    const titleBytes = readBytes(this, 0x134, titleLength);
    return String.fromCharCode(...titleBytes);
  }

  get globalChecksum() {
    const checksumBytes = readBytes(this, 0x14e, 2);
    return (checksumBytes[1] << 8) | checksumBytes[0];
  }

  get isNew() {
    return this.read(0x14b) === 0x33;
  }

  read(address: number): number {
    return this.mbc.read(address);
  }

  write(address: number, value: number): void {
    this.mbc.write(address, value);
  }

  loadSaveFile() {
    return this.mbc.loadCartridge();
  }
}
