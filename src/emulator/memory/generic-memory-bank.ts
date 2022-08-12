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

  toString() {
    const lines = [];
    for (let i = 0; i < this.memory.length; i += 16) {
      const line = `${(i + this.offset).toString(16).padStart(4, "0")}: ${[
        ...this.memory.slice(i, i + 16),
      ]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join(" ")}`;
      lines.push(line);
    }
    return lines.join("\n").toUpperCase();
  }
}
