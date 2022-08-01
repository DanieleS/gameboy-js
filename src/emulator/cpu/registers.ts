export class Registers {
  public A: number = 0x01;
  public B: number = 0x00;
  public C: number = 0x13;
  public D: number = 0x00;
  public E: number = 0xd8;
  public F: number = 0xb0;
  public H: number = 0x01;
  public L: number = 0x4d;

  public SP: number = 0xfffe;
  public PC: number = 0x0100;

  public set AF(value: number) {
    this.A = value >> 8;
    this.F = value & 0xf0;
  }
  public set BC(value: number) {
    this.B = value >> 8;
    this.C = value & 0xff;
  }
  public set DE(value: number) {
    this.D = value >> 8;
    this.E = value & 0xff;
  }
  public set HL(value: number) {
    this.H = value >> 8;
    this.L = value & 0xff;
  }

  public get AF(): number {
    return (this.A << 8) | this.F;
  }
  public get BC(): number {
    return (this.B << 8) | this.C;
  }
  public get DE(): number {
    return (this.D << 8) | this.E;
  }
  public get HL(): number {
    return (this.H << 8) | this.L;
  }

  public get flags(): FlagRegister {
    return getFlagRegister(this.F);
  }

  public set flags(value: FlagRegister) {
    this.F = createFlagRegister(value);
  }

  public toString(): string {
    return `BC=${this.BC.toString(16).padStart(4, "0")} DE=${this.DE.toString(
      16
    ).padStart(4, "0")} HL=${this.HL.toString(16).padStart(
      4,
      "0"
    )} AF=${this.AF.toString(16).padStart(4, "0")} SP=${this.SP.toString(
      16
    ).padStart(4, "0")} PC=${this.PC.toString(16).padStart(
      4,
      "0"
    )}`.toUpperCase();
  }
}

export type FlagRegister = {
  Z: boolean;
  N: boolean;
  H: boolean;
  C: boolean;
};

function getFlagRegister(flagRegister: number): FlagRegister {
  return {
    Z: (flagRegister & 0x80) === 0x80,
    N: (flagRegister & 0x40) === 0x40,
    H: (flagRegister & 0x20) === 0x20,
    C: (flagRegister & 0x10) === 0x10,
  };
}

function createFlagRegister(flags: FlagRegister) {
  return (
    (flags.Z ? 0x80 : 0) |
    (flags.N ? 0x40 : 0) |
    (flags.H ? 0x20 : 0) |
    (flags.C ? 0x10 : 0)
  );
}
