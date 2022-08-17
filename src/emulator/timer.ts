import { Interrupt, requestInterrupt } from "./cpu/interrupts";
import { overflowingAdd, wrappingAdd } from "./cpu/math";
import { Memory } from "./memory/memory";

const divAddress = 0xff04;
const timaAddress = 0xff05;
const tmaAddress = 0xff06;
const tacAddress = 0xff07;

export class Timer {
  private divCycles = 256;
  private tmaCycles = 4096;

  public tick(cycles: number, memory: Memory) {
    this.tickDiv(cycles, memory);
    this.tickTma(cycles, memory);
  }

  private tickDiv(cycles: number, memory: Memory) {
    this.divCycles -= cycles;
    if (this.divCycles <= 0) {
      const oldDivValue = memory.read(divAddress);
      memory.write(divAddress, wrappingAdd(oldDivValue, 1));
      this.divCycles += 256;
    }
  }

  private tickTma(cycles: number, memory: Memory) {
    const tac = memory.read(tacAddress);

    if ((tac & 0x4) === 0x4) {
      const cyclesMult = [4, 256, 128, 16][tac & 0x11];
      this.tmaCycles -= cycles * cyclesMult;
      if (this.tmaCycles <= 0) {
        this.tmaCycles += 4096;
        const tima = memory.read(timaAddress);
        const [newTima, overflow] = overflowingAdd(tima, 1);
        if (overflow) {
          const tma = memory.read(tmaAddress);
          memory.write(timaAddress, tma);
          requestInterrupt(memory, Interrupt.Timer);
        } else {
          memory.write(tima, newTima);
        }
      }
    }
  }
}
