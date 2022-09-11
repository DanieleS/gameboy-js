import { EventEmitter } from "../../utils/event-emitter";
import { GameboyDatabase } from "../../utils/indexed-db";
import { Cartridge } from "../cartridge";
import { contains } from "../cpu/math";
import { EmulatorEvent } from "../events";
import { GenericMemoryBank } from "../memory/generic-memory-bank";
import { Memory } from "../memory/memory";

abstract class BaseMbc implements Memory {
  abstract read(address: number): number;
  abstract write(address: number, value: number): void;
  async loadCartridge() {}
}

class NoMbc extends BaseMbc {
  public code = 0x0 as const;
  private ram: GenericMemoryBank = new GenericMemoryBank(0x2000, 0xa000); // Cartridges without MBC, an external RAM bank can be used

  constructor(private rom: Uint8Array) {
    super();
  }

  public read(address: number): number {
    if (contains(0xa000, 0xbfff, address)) {
      return this.ram.read(address);
    } else {
      return this.rom[address];
    }
  }

  public write(address: number, value: number): void {
    if (contains(0xa000, 0xbfff, address)) {
      this.ram.write(address, value);
    }
  }
}

class Mbc1 extends BaseMbc {
  public code = 0x1 as const;
  private selectedRomBank = 0;
  private ram: GenericMemoryBank = new GenericMemoryBank(0x2000, 0xa000);
  constructor(private rom: Uint8Array) {
    super();
  }

  public read(address: number): number {
    if (contains(0x0000, 0x3fff, address)) {
      return this.rom[address];
    } else if (contains(0xa000, 0xbfff, address)) {
      return this.ram.read(address);
    } else {
      return this.rom[address + (this.selectedRomBank - 1) * 0x4000];
    }
  }

  public write(address: number, value: number): void {
    if (contains(0x2000, 0x3fff, address)) {
      this.selectedRomBank = value ? value & 0x1f : 1;
    } else if (contains(0xa000, 0xbfff, address)) {
      this.ram.write(address, value);
    }
  }
}

class Mbc3 extends BaseMbc {
  public code = 0x13 as const;
  private selectedRomBank = 0;
  private selectedRamBank = 0;
  private ram: Uint8Array = new Uint8Array(0x8000);
  constructor(
    private rom: Uint8Array,
    private cartridge: Cartridge,
    private eventEmitter: EventEmitter<EmulatorEvent>
  ) {
    super();
  }

  public read(address: number): number {
    if (contains(0x0000, 0x3fff, address)) {
      return this.rom[address];
    } else if (contains(0xa000, 0xbfff, address)) {
      return this.ram[address - 0xa000 + this.selectedRamBank * 0x2000];
    } else {
      return this.rom[address + (this.selectedRomBank - 1) * 0x4000];
    }
  }

  public write(address: number, value: number): void {
    if (contains(0x2000, 0x3fff, address)) {
      this.selectedRomBank = value ? value & 0x7f : 1;
    } else if (contains(0x4000, 0x5fff, address)) {
      this.selectedRamBank = value;
    } else if (contains(0x0, 0x1fff, address)) {
      if (value === 0) {
        this.eventEmitter.emit("save", this.cartridge, this.ram);
      }
    } else if (contains(0xa000, 0xbfff, address)) {
      this.ram[address - 0xa000 + this.selectedRamBank * 0x2000] = value;
    }
  }

  override async loadCartridge(): Promise<void> {
    const db = new GameboyDatabase();
    const saveFile = await db.saveFiles.get(this.cartridge.id);

    if (saveFile) {
      const data = await saveFile.data.arrayBuffer();
      this.ram = new Uint8Array(data);
    }
  }
}

export type Mbc = NoMbc | Mbc1 | Mbc3;

export const mbcAddress = 0x147;

export function createMbc(
  cartridge: Cartridge,
  code: number,
  rom: Uint8Array,
  eventEmitter: EventEmitter<EmulatorEvent>
): Mbc {
  switch (code) {
    case 0x0:
      return new NoMbc(rom);
    case 0x1:
      return new Mbc1(rom);
    case 0x13:
      return new Mbc3(rom, cartridge, eventEmitter);
    default:
      throw new Error(`Unknown MBC code: ${code}`);
  }
}
