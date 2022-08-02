import { MemoryBus } from "../memory/memory-bus";
import { decodeOpcode } from "./instruction-parser";
import { Instruction } from "./instructions";
import { Registers } from "./registers";

export class CPU {
  public registers: Registers = new Registers();

  public executeStep(memory: MemoryBus) {
    const instruction = this.fetchDecode(memory);
    console.log(instruction);
  }

  private fetchDecode(memory: MemoryBus): Instruction {
    const opcode = memory.read(this.registers.PC);
    const instruction = decodeOpcode(opcode, false);

    if (instruction === "extended") {
      return decodeOpcode(memory.read(this.registers.PC + 1), true);
    }

    return instruction;
  }
}
