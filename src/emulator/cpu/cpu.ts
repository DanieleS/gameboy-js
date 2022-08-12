import { Memory } from "../memory/memory";
import { MemoryBus } from "../memory/memory-bus";
import { read16, readSigned, write16 } from "../memory/utils";
import { decodeOpcode } from "./instruction-parser";
import {
  ArithmeticSource8,
  ArithmeticTarget8,
  Instruction,
  JumpCondition,
  LoadSource8,
  LoadTarget8,
  PushPopTarget,
  ReadFromMemorySource,
  Register16Bit,
} from "./instructions";
import {
  overflowingAdd,
  overflowingSub,
  rotateLeft,
  rotateRight,
  testAddCarryBit,
  wrappingAdd,
  wrappingAdd16,
  wrappingSub,
  wrappingSub16,
} from "./math";
import { Registers } from "./registers";

type ExecutionStep = {
  PC: number;
  cycles: number;
  hatled?: true;
};

export class CPU {
  public registers: Registers = new Registers();

  private pop(memory: Memory): number {
    const value = read16(memory, this.registers.SP);
    this.registers.SP += 2;
    return value;
  }

  private push(memory: Memory, value: number) {
    this.registers.SP -= 2;
    write16(memory, this.registers.SP, value);
  }

  public executeStep(memory: MemoryBus) {
    const instruction = this.fetchDecode(memory);

    const step = this.executeInstruction(instruction, memory);

    this.registers.PC = step.PC;

    return step.cycles;
  }

  private fetchDecode(memory: Memory): Instruction {
    const opcode = memory.read(this.registers.PC);
    const instruction = decodeOpcode(opcode, false);

    if (instruction === "extended") {
      return decodeOpcode(memory.read(this.registers.PC + 1), true);
    }

    return instruction;
  }

  private executeInstruction(
    instruction: Instruction,
    memory: MemoryBus
  ): ExecutionStep {
    switch (instruction.instruction) {
      case "noop":
        return this.executeNoop();
      case "load":
        return this.executeLoad(memory, instruction.from, instruction.to);
      case "add":
        return this.executeAdd(memory, instruction.from);
      case "addCarry":
        return this.executeAddCarry(memory, instruction.from);
      case "subtract":
        return this.executeSubtract(memory, instruction.from);
      case "subtractCarry":
        return this.executeSubtractCarry(memory, instruction.from);
      case "and":
        return this.executeAnd(memory, instruction.from);
      case "xor":
        return this.executeXor(memory, instruction.from);
      case "or":
        return this.executeOr(memory, instruction.from);
      case "cp":
        return this.executeCompare(memory, instruction.from);
      case "add16":
        return this.executeAdd16(memory, instruction.from);
      case "jump":
        return this.executeJump(memory, instruction.condition);
      case "jumpHL":
        return this.executeJumpHL();
      case "relativeJump":
        return this.executeRelativeJump(memory, instruction.condition);
      case "readFromMemory":
        return this.executeReadFromMemory(memory, instruction.from);
      case "writeToMemory":
        return this.executeWriteToMemory(memory, instruction.to);
      case "writeToMemoryFromStackPointer":
        return this.executeWriteToMemoryFromStackPointer(memory);
      case "load16":
        return this.executeLoad16(memory, instruction.to);
      case "increment":
        return this.executeIncrement(memory, instruction.to);
      case "decrement":
        return this.executeDecrement(memory, instruction.to);
      case "increment16":
        return this.executeIncrement16(instruction.to);
      case "decrement16":
        return this.executeDecrement16(instruction.to);
      case "rotateLeftA":
        return this.executeRotateLeftA();
      case "rotateLeftCarryA":
        return this.executeRotateLeftCarryA();
      case "rotateRightA":
        return this.executeRotateRightA();
      case "rotateRightCarryA":
        return this.executeRotateRightCarryA();
      case "decimalAdjust":
        return this.executeDecimalAdjust();
      case "setCarryFlag":
        return this.executeSetCarryFlag();
      case "complement":
        return this.executeComplement();
      case "complementCarryFlag":
        return this.executeComplementCarryFlag();
      case "stop":
        throw new Error("Stop instruction not implemented");
      case "disableInterrupts":
        return this.executeDisableInterrupts(memory);
      case "enableInterrupts":
        return this.executeEnableInterrupts(memory);
      case "halt":
        return this.executeHalt();
      case "pop":
        return this.executePop(memory, instruction.to);
      case "push":
        return this.executePush(memory, instruction.to);
      case "call":
        return this.executeCall(memory, instruction.condition);
      case "return":
        return this.executeReturn(memory, instruction.condition);
      case "returnAndEnableInterrupts":
        return this.executeReturnAndEnableInterrupts(memory);
      case "restart":
        return this.executeRestart(memory, instruction.to);
      case "loadH":
        return this.executeLoadH(memory);
      case "writeH":
        return this.executeWriteH(memory);
      case "loadHC":
        return this.executeLoadHC(memory);
      case "writeHC":
        return this.executeWriteHC(memory);
      case "addSP":
        return this.executeAddSP(memory);
      case "loadSPHL":
        return this.executeLoadSPHL(memory);
      case "loadHLSP":
        return this.executeLoadHLSP(memory);
      case "rotateLeft":
        return this.executeRotateLeft(memory, instruction.to);
      case "rotateRight":
        return this.executeRotateRight(memory, instruction.to);
      case "rotateLeftCarry":
        return this.executeRotateLeftCarry(memory, instruction.to);
      case "rotateRightCarry":
        return this.executeRotateRightCarry(memory, instruction.to);
      case "shiftLeftArithmetic":
        return this.executeShiftLeftArithmetic(memory, instruction.to);
      case "shiftRightArithmetic":
        return this.executeShiftRightArithmetic(memory, instruction.to);
      case "shiftRightLogic":
        return this.executeShiftRightLogic(memory, instruction.to);
      case "swap":
        return this.executeSwap(memory, instruction.to);
      case "testBit":
        return this.executeTestBit(memory, instruction.bit, instruction.to);
      case "resetBit":
        return this.executeResetBit(memory, instruction.bit, instruction.to);
      case "setBit":
        return this.executeSetBit(memory, instruction.bit, instruction.to);
    }
  }

  private executeNoop(): ExecutionStep {
    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeLoad(
    memory: Memory,
    from: LoadSource8,
    to: LoadTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, from);

    switch (to) {
      case "A":
        this.registers.A = value;
        break;
      case "B":
        this.registers.B = value;
        break;
      case "C":
        this.registers.C = value;
        break;
      case "D":
        this.registers.D = value;
        break;
      case "E":
        this.registers.E = value;
        break;
      case "H":
        this.registers.H = value;
        break;
      case "L":
        this.registers.L = value;
        break;
      case "(HL)":
        memory.write(this.registers.HL, value);
        break;
      case "(immediate)":
        memory.write(read16(memory, this.registers.PC + 1), value);
        break;
    }

    return {
      PC:
        this.registers.PC +
        (from === "(immediate)" || to === "(immediate)"
          ? 3
          : from === "immediate"
          ? 2
          : 1),
      cycles:
        from === "(HL)" || to === "(HL)" || from === "immediate"
          ? 8
          : from === "(immediate)" || to === "(immediate)"
          ? 12
          : 4,
    };
  }

  private executeAdd(memory: Memory, from: ArithmeticSource8): ExecutionStep {
    const value = getValue8(this, memory, from);
    const [result, carry] = overflowingAdd(this.registers.A, value);

    const flags = this.registers.flags;
    flags.Z = result === 0;
    flags.N = false;
    flags.H = (value & 0x0f) + (this.registers.A & 0x0f) > 0x0f;
    flags.C = carry;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeAddCarry(
    memory: Memory,
    from: ArithmeticSource8
  ): ExecutionStep {
    const flags = this.registers.flags;
    const carry = flags.C ? 1 : 0;

    const value = getValue8(this, memory, from);
    const result = wrappingAdd(wrappingAdd(this.registers.A, value), carry);

    flags.Z = result === 0;
    flags.N = false;
    flags.H = (value & 0x0f) + (this.registers.A & 0x0f) + carry > 0x0f;
    flags.C = this.registers.A + value + carry > 0xff;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeSubtract(
    memory: Memory,
    from: ArithmeticSource8
  ): ExecutionStep {
    const value = getValue8(this, memory, from);
    const [result, overflow] = overflowingSub(this.registers.A, value);

    const flags = this.registers.flags;
    flags.Z = result === 0;
    flags.N = true;
    flags.C = overflow;
    flags.H =
      (wrappingSub(this.registers.A & 0xf, value & 0xf) & (0xf + 1)) !== 0;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeSubtractCarry(
    memory: Memory,
    from: ArithmeticSource8
  ): ExecutionStep {
    const flags = this.registers.flags;
    const carry = flags.C ? 1 : 0;
    const value = getValue8(this, memory, from);
    const result = wrappingSub(wrappingSub(this.registers.A, value), carry);

    flags.Z = result === 0;
    flags.N = true;
    flags.C = this.registers.A < value + carry;
    flags.H =
      (wrappingSub(wrappingSub(this.registers.A & 0xf, value & 0xf), carry) &
        (0xf + 1)) !==
      0;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeAnd(memory: Memory, from: ArithmeticSource8): ExecutionStep {
    const value = getValue8(this, memory, from);

    const result = this.registers.A & value;

    const flags = this.registers.flags;
    flags.Z = result == 0;
    flags.N = false;
    flags.C = false;
    flags.H = true;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeXor(memory: Memory, from: ArithmeticSource8): ExecutionStep {
    const value = getValue8(this, memory, from);

    const result = this.registers.A ^ value;

    const flags = this.registers.flags;
    flags.Z = result == 0;
    flags.N = false;
    flags.C = false;
    flags.H = false;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeOr(memory: Memory, from: ArithmeticSource8): ExecutionStep {
    const value = getValue8(this, memory, from);

    const result = this.registers.A | value;

    const flags = this.registers.flags;
    flags.Z = result == 0;
    flags.N = false;
    flags.C = false;
    flags.H = false;
    this.registers.flags = flags;

    this.registers.A = result;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeCompare(
    memory: Memory,
    from: ArithmeticSource8
  ): ExecutionStep {
    const value = getValue8(this, memory, from);

    const flags = this.registers.flags;
    flags.Z = this.registers.A === value;
    flags.N = true;
    flags.C = this.registers.A < value;
    flags.H =
      (wrappingSub(this.registers.A & 0xf, value & 0xf) & (0xf + 1)) !== 0;
    this.registers.flags = flags;

    return getArictmeticExecutionStep(this.registers.PC, from);
  }

  private executeAdd16(memory: Memory, from: Register16Bit): ExecutionStep {
    const value = getValue16(this, from);

    const HL = this.registers.HL;
    const result = wrappingAdd16(HL, value);

    const flags = this.registers.flags;
    flags.N = false;
    flags.C = HL + value > 0xffff;
    flags.H = testAddCarryBit(11, HL, value);
    this.registers.flags = flags;

    this.registers.HL = result;

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeJump(memory: Memory, condition: JumpCondition): ExecutionStep {
    if (checkJumpCondition(this, condition)) {
      const address = read16(memory, this.registers.PC + 1);
      return {
        PC: address,
        cycles: 16,
      };
    } else {
      return {
        PC: this.registers.PC + 3,
        cycles: 12,
      };
    }
  }

  private executeJumpHL(): ExecutionStep {
    const address = this.registers.HL;
    return {
      PC: address,
      cycles: 4,
    };
  }

  private executeRelativeJump(
    memory: Memory,
    condition: JumpCondition
  ): ExecutionStep {
    if (checkJumpCondition(this, condition)) {
      const offest = readSigned(memory, this.registers.PC + 1);
      const address = this.registers.PC + offest + 2;
      return {
        PC: address,
        cycles: 12,
      };
    } else {
      return {
        PC: this.registers.PC + 2,
        cycles: 8,
      };
    }
  }

  private executeReadFromMemory(
    memory: Memory,
    from: ReadFromMemorySource
  ): ExecutionStep {
    const getAddress = () => {
      switch (from) {
        case "(BC)":
          return this.registers.BC;
        case "(DE)":
          return this.registers.DE;
        case "(HL+)":
          return this.registers.HL++;
        case "(HL-)":
          return this.registers.HL--;
      }
    };

    const address = getAddress();
    const value = memory.read(address);
    this.registers.A = value;

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeWriteToMemory(
    memory: Memory,
    to: ReadFromMemorySource
  ): ExecutionStep {
    const getAddress = () => {
      switch (to) {
        case "(BC)":
          return this.registers.BC;
        case "(DE)":
          return this.registers.DE;
        case "(HL+)":
          return this.registers.HL++;
        case "(HL-)":
          return this.registers.HL--;
      }
    };

    const address = getAddress();
    memory.write(address, this.registers.A);

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeWriteToMemoryFromStackPointer(memory: Memory): ExecutionStep {
    const address = read16(memory, this.registers.PC + 1);
    write16(memory, address, this.registers.SP);

    return {
      PC: this.registers.PC + 3,
      cycles: 20,
    };
  }

  private executeLoad16(memory: Memory, to: Register16Bit): ExecutionStep {
    const value = read16(memory, this.registers.PC + 1);

    switch (to) {
      case "BC":
        this.registers.BC = value;
        break;
      case "DE":
        this.registers.DE = value;
        break;
      case "HL":
        this.registers.HL = value;
        break;
      case "SP":
        this.registers.SP = value;
        break;
    }

    return {
      PC: this.registers.PC + 3,
      cycles: 12,
    };
  }

  private executeIncrement(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);

    const result = wrappingAdd(value, 1);

    const flags = this.registers.flags;
    flags.Z = result == 0;
    flags.N = false;
    flags.H = (value & 0xf) === 0xf;
    this.registers.flags = flags;

    setValue8(this, memory, to, result);

    return {
      PC: this.registers.PC + 1,
      cycles: to === "(HL)" ? 8 : 4,
    };
  }

  private executeDecrement(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);

    const result = wrappingSub(value, 1);

    const flags = this.registers.flags;
    flags.Z = result == 0;
    flags.N = true;
    flags.H = (value & 0xf) === 0;
    this.registers.flags = flags;

    setValue8(this, memory, to, result);

    return {
      PC: this.registers.PC + 1,
      cycles: to === "(HL)" ? 8 : 4,
    };
  }

  private executeIncrement16(to: Register16Bit): ExecutionStep {
    const value = getValue16(this, to);

    const result = wrappingAdd16(value, 1);

    setValue16(this, to, result);

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeDecrement16(to: Register16Bit): ExecutionStep {
    const value = getValue16(this, to);

    const result = wrappingSub16(value, 1);

    setValue16(this, to, result);

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeRotateLeftA(): ExecutionStep {
    const value = this.registers.A;
    const result = rotateLeft(value, 1);

    const flags = this.registers.flags;
    flags.Z = false;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x80) !== 0;
    this.registers.flags = flags;

    this.registers.A = result;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeRotateLeftCarryA(): ExecutionStep {
    const flags = this.registers.flags;
    const carry = flags.C ? 1 : 0;

    const value = this.registers.A;
    const result = ((value << 1) | carry) & 0xff;

    flags.Z = false;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x80) !== 0;
    this.registers.flags = flags;

    this.registers.A = result;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeRotateRightA(): ExecutionStep {
    const value = this.registers.A;
    const result = rotateRight(value, 1);

    const flags = this.registers.flags;
    flags.Z = false;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    this.registers.A = result;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeRotateRightCarryA(): ExecutionStep {
    const value = this.registers.A;
    const carry = this.registers.flags.C ? 1 : 0;
    const result = (value >> 1) | (carry << 7);

    const flags = this.registers.flags;
    flags.Z = false;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    this.registers.A = result;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeDecimalAdjust(): ExecutionStep {
    const flags = this.registers.flags;
    if (flags.N) {
      if (flags.C) {
        this.registers.A = wrappingSub(this.registers.A, 0x60);
      }
      if (flags.H) {
        this.registers.A = wrappingSub(this.registers.A, 0x06);
      }
    } else {
      if (flags.C || this.registers.A > 0x99) {
        this.registers.A = wrappingAdd(this.registers.A, 0x60);
        flags.C = true;
      }
      if (flags.H || (this.registers.A & 0x0f) > 0x09) {
        this.registers.A = wrappingAdd(this.registers.A, 0x06);
      }
    }

    flags.Z = this.registers.A == 0;
    flags.H = false;
    this.registers.flags = flags;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeSetCarryFlag(): ExecutionStep {
    const flags = this.registers.flags;
    flags.C = true;
    flags.H = false;
    flags.N = false;
    this.registers.flags = flags;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeComplement(): ExecutionStep {
    this.registers.A = 0xff - this.registers.A;

    const flags = this.registers.flags;
    flags.N = true;
    flags.H = true;
    this.registers.flags = flags;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeComplementCarryFlag(): ExecutionStep {
    const flags = this.registers.flags;
    flags.N = false;
    flags.H = false;
    flags.C = !flags.C;
    this.registers.flags = flags;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeDisableInterrupts(memory: MemoryBus): ExecutionStep {
    memory.interruptEnabled = false;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeEnableInterrupts(memory: MemoryBus): ExecutionStep {
    memory.interruptEnabled = true;

    return {
      PC: this.registers.PC + 1,
      cycles: 4,
    };
  }

  private executeHalt(): ExecutionStep {
    return {
      PC: this.registers.PC + 1,
      cycles: 4,
      hatled: true,
    };
  }

  private executePop(memory: Memory, to: PushPopTarget): ExecutionStep {
    const value = this.pop(memory);

    setValue16(this, to, value);

    return {
      PC: this.registers.PC + 1,
      cycles: 12,
    };
  }

  private executePush(memory: Memory, to: PushPopTarget): ExecutionStep {
    const value = getValue16(this, to);

    this.push(memory, value);

    return {
      PC: this.registers.PC + 1,
      cycles: 16,
    };
  }

  private executeCall(memory: Memory, condition: JumpCondition): ExecutionStep {
    if (checkJumpCondition(this, condition)) {
      const PC = this.registers.PC;
      this.push(memory, this.registers.PC + 3);

      const address = read16(memory, this.registers.PC + 1);

      return {
        PC: address,
        cycles: 24,
      };
    } else {
      return {
        PC: this.registers.PC + 3,
        cycles: 12,
      };
    }
  }

  private executeReturn(
    memory: Memory,
    condition: JumpCondition
  ): ExecutionStep {
    if (checkJumpCondition(this, condition)) {
      const address = this.pop(memory);

      return {
        PC: address,
        cycles: 16,
      };
    } else {
      return {
        PC: this.registers.PC + 1,
        cycles: 8,
      };
    }
  }

  private executeReturnAndEnableInterrupts(memory: MemoryBus): ExecutionStep {
    this.executeEnableInterrupts(memory);
    return this.executeReturn(memory, "always");
  }

  private executeRestart(
    memory: Memory,
    to: 0x0 | 0x8 | 0x10 | 0x18 | 0x20 | 0x28 | 0x30 | 0x38
  ): ExecutionStep {
    this.push(memory, this.registers.PC + 1);

    return {
      PC: to,
      cycles: 16,
    };
  }

  private executeLoadH(memory: Memory): ExecutionStep {
    const halfAddress = memory.read(this.registers.PC + 1);
    this.registers.A = memory.read(halfAddress + 0xff00);

    return {
      PC: this.registers.PC + 2,
      cycles: 12,
    };
  }

  private executeWriteH(memory: Memory): ExecutionStep {
    const halfAddress = memory.read(this.registers.PC + 1);
    memory.write(halfAddress + 0xff00, this.registers.A);

    return {
      PC: this.registers.PC + 2,
      cycles: 12,
    };
  }

  private executeLoadHC(memory: Memory): ExecutionStep {
    const halfAddress = this.registers.C;
    this.registers.A = memory.read(halfAddress + 0xff00);

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeWriteHC(memory: Memory): ExecutionStep {
    const halfAddress = this.registers.C;
    memory.write(halfAddress + 0xff00, this.registers.A);

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeAddSP(memory: Memory): ExecutionStep {
    const offset = readSigned(memory, this.registers.PC + 1);
    const SP = this.registers.SP;

    this.registers.SP = wrappingAdd16(SP, offset);

    const flags = this.registers.flags;
    flags.Z = false;
    flags.N = false;
    flags.H = testAddCarryBit(3, SP, offset);
    flags.C = testAddCarryBit(7, SP, offset);
    this.registers.flags = flags;

    return {
      PC: this.registers.PC + 2,
      cycles: 16,
    };
  }

  private executeLoadSPHL(memory: Memory): ExecutionStep {
    this.registers.SP = this.registers.HL;

    return {
      PC: this.registers.PC + 1,
      cycles: 8,
    };
  }

  private executeLoadHLSP(memory: Memory): ExecutionStep {
    const SP = this.registers.SP;

    this.executeAddSP(memory);

    this.registers.HL = this.registers.SP;
    this.registers.SP = SP;

    return {
      PC: this.registers.PC + 2,
      cycles: 12,
    };
  }

  private executeRotateLeft(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = rotateLeft(value, 1);

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x80) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeRotateLeftCarry(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const carry = this.registers.flags.C ? 1 : 0;
    const newValue = ((value << 1) | carry) & 0xff;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x80) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeRotateRight(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = rotateRight(value, 1);

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeRotateRightCarry(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const carry = this.registers.flags.C ? 1 : 0;
    const newValue = ((value >> 1) | (carry << 7)) & 0xff;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeShiftLeftArithmetic(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = (value << 1) & 0xff;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x80) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeShiftRightArithmetic(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const hi = value & 0x80;
    const newValue = (value >> 1) | hi;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeShiftRightLogic(
    memory: Memory,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = (value >> 1) & 0xff;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = (value & 0x01) !== 0;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeSwap(memory: Memory, to: ArithmeticTarget8): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = ((value >> 4) | (value << 4)) & 0xff;

    setValue8(this, memory, to, newValue);

    const flags = this.registers.flags;
    flags.Z = newValue === 0;
    flags.N = false;
    flags.H = false;
    flags.C = false;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeTestBit(
    memory: Memory,
    bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const bitValue = getBit(value, bit);

    const flags = this.registers.flags;
    flags.Z = bitValue === 0;
    flags.N = false;
    flags.H = true;
    this.registers.flags = flags;

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeResetBit(
    memory: Memory,
    bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = resetBit(value, bit);

    setValue8(this, memory, to, newValue);

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }

  private executeSetBit(
    memory: Memory,
    bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    to: ArithmeticTarget8
  ): ExecutionStep {
    const value = getValue8(this, memory, to);
    const newValue = setBit(value, bit);

    setValue8(this, memory, to, newValue);

    return getBitArictmeticExecutionStep(this.registers.PC, to);
  }
}

function getValue8(cpu: CPU, memory: Memory, from: LoadSource8): number {
  switch (from) {
    case "A":
      return cpu.registers.A;
    case "B":
      return cpu.registers.B;
    case "C":
      return cpu.registers.C;
    case "D":
      return cpu.registers.D;
    case "E":
      return cpu.registers.E;
    case "H":
      return cpu.registers.H;
    case "L":
      return cpu.registers.L;
    case "(HL)":
      return memory.read(cpu.registers.HL);
    case "immediate":
      return memory.read(cpu.registers.PC + 1);
    case "(immediate)":
      const address = read16(memory, cpu.registers.PC + 1);
      return memory.read(address);
  }
}

function setValue8(
  cpu: CPU,
  memory: Memory,
  from: ArithmeticTarget8,
  value: number
): void {
  switch (from) {
    case "A":
      cpu.registers.A = value;
      break;
    case "B":
      cpu.registers.B = value;
      break;
    case "C":
      cpu.registers.C = value;
      break;
    case "D":
      cpu.registers.D = value;
      break;
    case "E":
      cpu.registers.E = value;
      break;
    case "H":
      cpu.registers.H = value;
      break;
    case "L":
      cpu.registers.L = value;
      break;
    case "(HL)":
      memory.write(cpu.registers.HL, value);
      break;
  }
}

function getValue16(cpu: CPU, from: Register16Bit | PushPopTarget): number {
  switch (from) {
    case "BC":
      return cpu.registers.BC;
    case "DE":
      return cpu.registers.DE;
    case "HL":
      return cpu.registers.HL;
    case "SP":
      return cpu.registers.SP;
    case "AF":
      return cpu.registers.AF;
  }
}

function setValue16(
  cpu: CPU,
  to: Register16Bit | PushPopTarget,
  value: number
): void {
  switch (to) {
    case "BC":
      cpu.registers.BC = value;
      break;
    case "DE":
      cpu.registers.DE = value;
      break;
    case "HL":
      cpu.registers.HL = value;
      break;
    case "SP":
      cpu.registers.SP = value;
      break;
    case "AF":
      cpu.registers.AF = value;
      break;
  }
}

function getArictmeticExecutionStep(
  programCounter: number,
  from: ArithmeticSource8
): ExecutionStep {
  const PC = from === "immediate" ? programCounter + 2 : programCounter + 1;

  const cycles = from === "immediate" || from === "(HL)" ? 8 : 4;

  return {
    PC,
    cycles,
  };
}

function getBitArictmeticExecutionStep(
  programCounter: number,
  to: ArithmeticSource8
): ExecutionStep {
  return {
    PC: programCounter + 2,
    cycles: to === "(HL)" ? 16 : 8,
  };
}

function getBit(value: number, bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): number {
  return (value >> bit) & 0x01;
}

function setBit(value: number, bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): number {
  return value | (1 << bit);
}

function resetBit(value: number, bit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): number {
  return value & ~(1 << bit);
}

function checkJumpCondition(cpu: CPU, condition: JumpCondition): boolean {
  const flags = cpu.registers.flags;
  switch (condition) {
    case "NZ":
      return !flags.Z;
    case "Z":
      return flags.Z;
    case "NC":
      return !flags.C;
    case "C":
      return flags.C;
    case "always":
      return true;
  }
}
