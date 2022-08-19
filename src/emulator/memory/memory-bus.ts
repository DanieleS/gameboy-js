import { Cartridge } from "../cartridge";
import { GenericMemoryBank } from "./generic-memory-bank";
import { dmaAddress, IOMemory } from "./io";
import { Memory } from "./memory";
import { readBytes } from "./utils";
export class MemoryBus implements Memory {
  public cartridge: Cartridge;
  public vram: Memory = new GenericMemoryBank(0x2000, 0x8000);
  public workRam: Memory = new GenericMemoryBank(0x2000, 0xc000);
  public oam: GenericMemoryBank = new GenericMemoryBank(0x100, 0xfe00);
  public io: IOMemory = new IOMemory();
  public hram: Memory = new GenericMemoryBank(0x7f, 0xff80);
  interruptEnabled: number = 0;

  constructor(cartridge: Cartridge) {
    this.cartridge = cartridge;
  }

  read(address: number): number {
    if (address < 0x8000) {
      return this.cartridge.read(address);
    } else if (address < 0xa000) {
      return this.vram.read(address);
    } else if (address < 0xc000) {
      return this.cartridge.read(address);
    } else if (address < 0xe000) {
      return this.workRam.read(address);
    } else if (address < 0xfe00) {
      throw new Error(
        "Unimplemented memory read from address: " + address.toString(16)
      );
    } else if (address < 0xfea0) {
      return this.oam.read(address);
    } else if (address < 0xff00) {
      return 0xff;
    } else if (address < 0xff80) {
      return this.io.read(address);
    } else if (address < 0xffff) {
      return this.hram.read(address);
    } else if (address === 0xffff) {
      return this.interruptEnabled;
    }

    throw new Error(
      "Unimplemented memory read from address: " + address.toString(16)
    );
  }

  write(address: number, value: number): void {
    if (address < 0x8000) {
      this.cartridge.write(address, value);
      return;
    } else if (address < 0xa000) {
      this.vram.write(address, value);
      return;
    } else if (address < 0xc000) {
      this.cartridge.write(address, value);
      return;
    } else if (address < 0xe000) {
      this.workRam.write(address, value);
      return;
    } else if (address < 0xfe00) {
      throw new Error(
        "Unimplemented memory write to address: " + address.toString(16)
      );
    } else if (address < 0xfea0) {
      this.oam.write(address, value);
      return;
    } else if (address < 0xff00) {
      return;
    } else if (address < 0xff80) {
      this.io.write(address, value);

      if (this.io.dmaTransferRequested) {
        this.io.dmaTransferRequested = false;
        this.dmaTransfer();
      }
      return;
    } else if (address < 0xffff) {
      this.hram.write(address, value);
      return;
    } else if (address === 0xffff) {
      this.interruptEnabled = value;
      return;
    }

    throw new Error(
      "Unimplemented memory write to address: " + address.toString(16)
    );
  }

  dmaTransfer() {
    let address = this.io.read(dmaAddress);
    address <<= 8;

    const data = readBytes(this, address, 0x100);
    this.oam.replaceData(data);
  }
}
