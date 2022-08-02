export type Register8Bit = "A" | "B" | "C" | "D" | "E" | "H" | "L";
export type Register16Bit = "BC" | "DE" | "HL" | "SP";
export type ArithmeticSource8 = Register8Bit | "(HL)" | "immediate";
export type ArithmeticTarget8 = Register8Bit | "(HL)";
export type JumpCondition = "always" | "Z" | "NZ" | "C" | "NC";
export type PushPopTarget = "AF" | "BC" | "DE" | "HL";
export type BitTarget = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type LoadTarget8 = ArithmeticTarget8 | "(immediate)";
export type LoadSource8 = ArithmeticSource8 | "(immediate)";
export type ReadFromMemorySource = "(BC)" | "(DE)" | "(HL+)" | "(HL-)";

export type Noop = {
  instruction: "noop";
};

export type Load8 = {
  instruction: "load";
  to: LoadTarget8;
  from: LoadSource8;
};

export type Load16 = {
  instruction: "load16";
  to: Register16Bit;
};

export type LoadSPHL = {
  instruction: "loadSPHL";
};

export type LoadHLSP = {
  instruction: "loadHLSP";
};

export type LoadH = {
  instruction: "loadH";
};

export type WriteH = {
  instruction: "writeH";
};

export type LoadHC = {
  instruction: "loadHC";
};

export type WriteHC = {
  instruction: "writeHC";
};

export type ReadFromMemory = {
  instruction: "readFromMemory";
  from: ReadFromMemorySource;
};

export type WriteToMemory = {
  instruction: "writeToMemory";
  to: ReadFromMemorySource;
};

export type WriteToMemoryFromStackPointer = {
  instruction: "writeToMemoryFromStackPointer";
};

export type Add = {
  instruction: "add";
  from: ArithmeticSource8;
};

export type AddCarry = {
  instruction: "addCarry";
  from: ArithmeticSource8;
};

export type Subtract = {
  instruction: "subtract";
  from: ArithmeticSource8;
};

export type SubtractCarry = {
  instruction: "subtractCarry";
  from: ArithmeticSource8;
};

export type And = {
  instruction: "and";
  from: ArithmeticSource8;
};

export type Xor = {
  instruction: "xor";
  from: ArithmeticSource8;
};

export type Or = {
  instruction: "or";
  from: ArithmeticSource8;
};

export type Cp = {
  instruction: "cp";
  from: ArithmeticSource8;
};

export type Add16 = {
  instruction: "add16";
  from: Register16Bit;
};

export type AddSP = {
  instruction: "addSP";
};

export type Increment = {
  instruction: "increment";
  to: ArithmeticTarget8;
};

export type Decrement = {
  instruction: "decrement";
  to: ArithmeticTarget8;
};

export type Increment16 = {
  instruction: "increment16";
  to: Register16Bit;
};

export type Decrement16 = {
  instruction: "decrement16";
  to: Register16Bit;
};

export type RotateLeftA = {
  instruction: "rotateLeftA";
};

export type RotateLeftCarryA = {
  instruction: "rotateLeftCarryA";
};

export type RotateRightA = {
  instruction: "rotateRightA";
};

export type RotateRightCarryA = {
  instruction: "rotateRightCarryA";
};

export type DecimalAdjust = {
  instruction: "decimalAdjust";
};

export type SetCarryFlag = {
  instruction: "setCarryFlag";
};

export type Complement = {
  instruction: "complement";
};

export type ComplementCarryFlag = {
  instruction: "complementCarryFlag";
};

export type Jump = {
  instruction: "jump";
  condition: JumpCondition;
};

export type JumpHL = {
  instruction: "jumpHL";
};

export type RelativeJump = {
  instruction: "relativeJump";
  condition: JumpCondition;
};

export type Push = {
  instruction: "push";
  to: PushPopTarget;
};

export type Pop = {
  instruction: "pop";
  to: PushPopTarget;
};

export type Stop = {
  instruction: "stop";
};

export type DisableInterrupts = {
  instruction: "disableInterrupts";
};

export type EnableInterrupts = {
  instruction: "enableInterrupts";
};

export type Call = {
  instruction: "call";
  condition: JumpCondition;
};

export type Restart = {
  instruction: "restart";
  to: 0x0 | 0x8 | 0x10 | 0x18 | 0x20 | 0x28 | 0x30 | 0x38;
};

export type Return = {
  instruction: "return";
  condition: JumpCondition;
};

export type ReturnAndEnableInterrupts = {
  instruction: "returnAndEnableInterrupts";
};

export type Halt = {
  instruction: "halt";
};

// Extended
export type RotateLeft = {
  instruction: "rotateLeft";
  to: ArithmeticTarget8;
};

export type RotateRight = {
  instruction: "rotateRight";
  to: ArithmeticTarget8;
};

export type RotateLeftCarry = {
  instruction: "rotateLeftCarry";
  to: ArithmeticTarget8;
};

export type RotateRightCarry = {
  instruction: "rotateRightCarry";
  to: ArithmeticTarget8;
};

export type ShiftLeftArithmetic = {
  instruction: "shiftLeftArithmetic";
  to: ArithmeticTarget8;
};

export type ShiftRightArithmetic = {
  instruction: "shiftRightArithmetic";
  to: ArithmeticTarget8;
};

export type Swap = {
  instruction: "swap";
  to: ArithmeticTarget8;
};

export type ShiftRightLogic = {
  instruction: "shiftRightLogic";
  to: ArithmeticTarget8;
};

export type TestBit = {
  instruction: "testBit";
  bit: BitTarget;
  to: ArithmeticTarget8;
};

export type ResetBit = {
  instruction: "resetBit";
  bit: BitTarget;
  to: ArithmeticTarget8;
};

export type SetBit = {
  instruction: "setBit";
  bit: BitTarget;
  to: ArithmeticTarget8;
};

export type Instruction =
  | Noop
  | Load8
  | Load16
  | LoadSPHL
  | LoadHLSP
  | LoadH
  | WriteH
  | LoadHC
  | WriteHC
  | ReadFromMemory
  | WriteToMemory
  | WriteToMemoryFromStackPointer
  | Add
  | AddCarry
  | Subtract
  | SubtractCarry
  | And
  | Xor
  | Or
  | Cp
  | Add16
  | AddSP
  | Increment
  | Decrement
  | Increment16
  | Decrement16
  | RotateLeftA
  | RotateLeftCarryA
  | RotateRightA
  | RotateRightCarryA
  | DecimalAdjust
  | SetCarryFlag
  | Complement
  | ComplementCarryFlag
  | Jump
  | JumpHL
  | RelativeJump
  | Push
  | Pop
  | Stop
  | DisableInterrupts
  | EnableInterrupts
  | Call
  | Restart
  | Return
  | ReturnAndEnableInterrupts
  | Halt
  | RotateLeft
  | RotateRight
  | RotateLeftCarry
  | RotateRightCarry
  | ShiftLeftArithmetic
  | ShiftRightArithmetic
  | Swap
  | ShiftRightLogic
  | TestBit
  | ResetBit
  | SetBit;
