import { GenericMemoryBank } from "./generic-memory-bank";
import { Memory } from "./memory";

export const joypAddress = 0xff00;
export const dmaAddress = 0xff46;

export class IOMemory implements Memory {
  private data = new GenericMemoryBank(0x80, 0xff00);
  private joyp = 0xff;

  public dmaTransferRequested = false;

  read(address: number): number {
    switch (address) {
      case joypAddress:
        return this.joyp;
      default:
        return this.data.read(address);
    }
  }

  write(address: number, value: number): void {
    switch (address) {
      case joypAddress:
        this.joyp = handleJoypWrite(this.joyp, value);
        break;
      case dmaAddress:
        this.dmaTransferRequested = true;
        this.data.write(address, value);
        break;
      default:
        this.data.write(address, value);
        break;
    }
  }
}

function handleJoypWrite(oldValue: number, value: number): number {
  if ((value & 0b0011_0000) != 0) {
    // Writing upper nibble
    return (oldValue & 0b0000_1111) | (value & 0b0011_0000) | 0xc0;
  } else {
    // Writing lower nibble
    return (oldValue & 0b1111_0000) | (value & 0b0000_1111);
  }
}
