import { Memory } from "./memory";

export class GenericMemoryBank implements Memory {
  private memory: Uint8Array;

  constructor(size: number, private offset: number) {
    this.memory = new Uint8Array(size);
  }

  read(address: number): number {
    return this.memory[address - this.offset];
  }

  write(address: number, value: number): void {
    this.memory[address - this.offset] = value;
  }
}
