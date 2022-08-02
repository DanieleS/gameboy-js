import { MemoryBus } from "../memory/memory-bus";
import { Instruction } from "./instructions";

function instructionFromOpcode(opcode: number): Instruction | "extended" {
  switch (opcode & 0xff) {
    case 0x00:
      return {
        instruction: "noop",
      };
    case 0x01:
      return {
        instruction: "load16",
        to: "BC",
      };
    case 0x02:
      return {
        instruction: "writeToMemory",
        to: "(BC)",
      };
    case 0x03:
      return {
        instruction: "increment16",
        to: "BC",
      };
    case 0x04:
      return {
        instruction: "increment",
        to: "B",
      };
    case 0x05:
      return {
        instruction: "decrement",
        to: "B",
      };
    case 0x06:
      return {
        instruction: "load",
        to: "B",
        from: "immediate",
      };
    case 0x07:
      return {
        instruction: "rotateLeftA",
      };
    case 0x08:
      return {
        instruction: "writeToMemoryFromStackPointer",
      };
    case 0x09:
      return {
        instruction: "add16",
        from: "BC",
      };
    case 0x0a:
      return {
        instruction: "readFromMemory",
        from: "(BC)",
      };
    case 0x0b:
      return {
        instruction: "decrement16",
        to: "BC",
      };
    case 0x0c:
      return {
        instruction: "increment",
        to: "C",
      };
    case 0x0d:
      return {
        instruction: "decrement",
        to: "C",
      };
    case 0x0e:
      return {
        instruction: "load",
        to: "C",
        from: "immediate",
      };
    case 0x0f:
      return {
        instruction: "rotateRightA",
      };
    case 0x10:
      return {
        instruction: "stop",
      };
    case 0x11:
      return {
        instruction: "load16",
        to: "DE",
      };
    case 0x12:
      return {
        instruction: "writeToMemory",
        to: "(DE)",
      };
    case 0x13:
      return {
        instruction: "increment16",
        to: "DE",
      };
    case 0x14:
      return {
        instruction: "increment",
        to: "D",
      };
    case 0x15:
      return {
        instruction: "decrement",
        to: "D",
      };
    case 0x16:
      return {
        instruction: "load",
        to: "D",
        from: "immediate",
      };
    case 0x17:
      return {
        instruction: "rotateLeftCarryA",
      };
    case 0x18:
      return {
        instruction: "relativeJump",
        condition: "always",
      };
    case 0x19:
      return {
        instruction: "add16",
        from: "DE",
      };
    case 0x1a:
      return {
        instruction: "readFromMemory",
        from: "(DE)",
      };
    case 0x1b:
      return {
        instruction: "decrement16",
        to: "DE",
      };
    case 0x1c:
      return {
        instruction: "increment",
        to: "E",
      };
    case 0x1d:
      return {
        instruction: "decrement",
        to: "E",
      };
    case 0x1e:
      return {
        instruction: "load",
        to: "E",
        from: "immediate",
      };
    case 0x1f:
      return {
        instruction: "rotateRightCarryA",
      };
    case 0x20:
      return {
        instruction: "relativeJump",
        condition: "NZ",
      };
    case 0x21:
      return {
        instruction: "load16",
        to: "HL",
      };
    case 0x22:
      return {
        instruction: "writeToMemory",
        to: "(HL+)",
      };
    case 0x23:
      return {
        instruction: "increment16",
        to: "HL",
      };
    case 0x24:
      return {
        instruction: "increment",
        to: "H",
      };
    case 0x25:
      return {
        instruction: "decrement",
        to: "H",
      };
    case 0x26:
      return {
        instruction: "load",
        to: "H",
        from: "immediate",
      };
    case 0x27:
      return {
        instruction: "decimalAdjust",
      };
    case 0x28:
      return {
        instruction: "relativeJump",
        condition: "Z",
      };
    case 0x29:
      return {
        instruction: "add16",
        from: "HL",
      };
    case 0x2a:
      return {
        instruction: "readFromMemory",
        from: "(HL+)",
      };
    case 0x2b:
      return {
        instruction: "decrement16",
        to: "HL",
      };
    case 0x2c:
      return {
        instruction: "increment",
        to: "L",
      };
    case 0x2d:
      return {
        instruction: "decrement",
        to: "L",
      };
    case 0x2e:
      return {
        instruction: "load",
        to: "L",
        from: "immediate",
      };
    case 0x2f:
      return {
        instruction: "complement",
      };
    case 0x30:
      return {
        instruction: "relativeJump",
        condition: "NC",
      };
    case 0x31:
      return {
        instruction: "load16",
        to: "SP",
      };
    case 0x32:
      return {
        instruction: "writeToMemory",
        to: "(HL-)",
      };
    case 0x33:
      return {
        instruction: "increment16",
        to: "SP",
      };
    case 0x34:
      return {
        instruction: "increment",
        to: "(HL)",
      };
    case 0x35:
      return {
        instruction: "decrement",
        to: "(HL)",
      };
    case 0x36:
      return {
        instruction: "load",
        to: "(HL)",
        from: "immediate",
      };
    case 0x37:
      return {
        instruction: "setCarryFlag",
      };
    case 0x38:
      return {
        instruction: "relativeJump",
        condition: "C",
      };
    case 0x39:
      return {
        instruction: "add16",
        from: "SP",
      };
    case 0x3a:
      return {
        instruction: "readFromMemory",
        from: "(HL-)",
      };
    case 0x3b:
      return {
        instruction: "decrement16",
        to: "SP",
      };
    case 0x3c:
      return {
        instruction: "increment",
        to: "A",
      };
    case 0x3d:
      return {
        instruction: "decrement",
        to: "A",
      };
    case 0x3e:
      return {
        instruction: "load",
        to: "A",
        from: "immediate",
      };
    case 0x3f:
      return {
        instruction: "complementCarryFlag",
      };
    case 0x40:
      return {
        instruction: "load",
        to: "B",
        from: "B",
      };
    case 0x41:
      return {
        instruction: "load",
        to: "B",
        from: "C",
      };
    case 0x42:
      return {
        instruction: "load",
        to: "B",
        from: "D",
      };
    case 0x43:
      return {
        instruction: "load",
        to: "B",
        from: "E",
      };
    case 0x44:
      return {
        instruction: "load",
        to: "B",
        from: "H",
      };
    case 0x45:
      return {
        instruction: "load",
        to: "B",
        from: "L",
      };
    case 0x46:
      return {
        instruction: "load",
        to: "B",
        from: "(HL)",
      };
    case 0x47:
      return {
        instruction: "load",
        to: "B",
        from: "A",
      };
    case 0x48:
      return {
        instruction: "load",
        to: "C",
        from: "B",
      };
    case 0x49:
      return {
        instruction: "load",
        to: "C",
        from: "C",
      };
    case 0x4a:
      return {
        instruction: "load",
        to: "C",
        from: "D",
      };
    case 0x4b:
      return {
        instruction: "load",
        to: "C",
        from: "E",
      };
    case 0x4c:
      return {
        instruction: "load",
        to: "C",
        from: "H",
      };
    case 0x4d:
      return {
        instruction: "load",
        to: "C",
        from: "L",
      };
    case 0x4e:
      return {
        instruction: "load",
        to: "C",
        from: "(HL)",
      };
    case 0x4f:
      return {
        instruction: "load",
        to: "C",
        from: "A",
      };
    case 0x50:
      return {
        instruction: "load",
        to: "D",
        from: "B",
      };
    case 0x51:
      return {
        instruction: "load",
        to: "D",
        from: "C",
      };
    case 0x52:
      return {
        instruction: "load",
        to: "D",
        from: "D",
      };
    case 0x53:
      return {
        instruction: "load",
        to: "D",
        from: "E",
      };
    case 0x54:
      return {
        instruction: "load",
        to: "D",
        from: "H",
      };
    case 0x55:
      return {
        instruction: "load",
        to: "D",
        from: "L",
      };
    case 0x56:
      return {
        instruction: "load",
        to: "D",
        from: "(HL)",
      };
    case 0x57:
      return {
        instruction: "load",
        to: "D",
        from: "A",
      };
    case 0x58:
      return {
        instruction: "load",
        to: "E",
        from: "B",
      };
    case 0x59:
      return {
        instruction: "load",
        to: "E",
        from: "C",
      };
    case 0x5a:
      return {
        instruction: "load",
        to: "E",
        from: "D",
      };
    case 0x5b:
      return {
        instruction: "load",
        to: "E",
        from: "E",
      };
    case 0x5c:
      return {
        instruction: "load",
        to: "E",
        from: "H",
      };
    case 0x5d:
      return {
        instruction: "load",
        to: "E",
        from: "L",
      };
    case 0x5e:
      return {
        instruction: "load",
        to: "E",
        from: "(HL)",
      };
    case 0x5f:
      return {
        instruction: "load",
        to: "E",
        from: "A",
      };
    case 0x60:
      return {
        instruction: "load",
        to: "H",
        from: "B",
      };
    case 0x61:
      return {
        instruction: "load",
        to: "H",
        from: "C",
      };
    case 0x62:
      return {
        instruction: "load",
        to: "H",
        from: "D",
      };
    case 0x63:
      return {
        instruction: "load",
        to: "H",
        from: "E",
      };
    case 0x64:
      return {
        instruction: "load",
        to: "H",
        from: "H",
      };
    case 0x65:
      return {
        instruction: "load",
        to: "H",
        from: "L",
      };
    case 0x66:
      return {
        instruction: "load",
        to: "H",
        from: "(HL)",
      };
    case 0x67:
      return {
        instruction: "load",
        to: "H",
        from: "A",
      };
    case 0x68:
      return {
        instruction: "load",
        to: "L",
        from: "B",
      };
    case 0x69:
      return {
        instruction: "load",
        to: "L",
        from: "C",
      };
    case 0x6a:
      return {
        instruction: "load",
        to: "L",
        from: "D",
      };
    case 0x6b:
      return {
        instruction: "load",
        to: "L",
        from: "E",
      };
    case 0x6c:
      return {
        instruction: "load",
        to: "L",
        from: "H",
      };
    case 0x6d:
      return {
        instruction: "load",
        to: "L",
        from: "L",
      };
    case 0x6e:
      return {
        instruction: "load",
        to: "L",
        from: "(HL)",
      };
    case 0x6f:
      return {
        instruction: "load",
        to: "L",
        from: "A",
      };
    case 0x70:
      return {
        instruction: "load",
        to: "(HL)",
        from: "B",
      };
    case 0x71:
      return {
        instruction: "load",
        to: "(HL)",
        from: "C",
      };
    case 0x72:
      return {
        instruction: "load",
        to: "(HL)",
        from: "D",
      };
    case 0x73:
      return {
        instruction: "load",
        to: "(HL)",
        from: "E",
      };
    case 0x74:
      return {
        instruction: "load",
        to: "(HL)",
        from: "H",
      };
    case 0x75:
      return {
        instruction: "load",
        to: "(HL)",
        from: "L",
      };
    case 0x76:
      return {
        instruction: "halt",
      };
    case 0x77:
      return {
        instruction: "load",
        to: "(HL)",
        from: "A",
      };
    case 0x78:
      return {
        instruction: "load",
        to: "A",
        from: "B",
      };
    case 0x79:
      return {
        instruction: "load",
        to: "A",
        from: "C",
      };
    case 0x7a:
      return {
        instruction: "load",
        to: "A",
        from: "D",
      };
    case 0x7b:
      return {
        instruction: "load",
        to: "A",
        from: "E",
      };
    case 0x7c:
      return {
        instruction: "load",
        to: "A",
        from: "H",
      };
    case 0x7d:
      return {
        instruction: "load",
        to: "A",
        from: "L",
      };
    case 0x7e:
      return {
        instruction: "load",
        to: "A",
        from: "(HL)",
      };
    case 0x7f:
      return {
        instruction: "load",
        to: "A",
        from: "A",
      };
    case 0x80:
      return {
        instruction: "add",
        from: "B",
      };
    case 0x81:
      return {
        instruction: "add",
        from: "C",
      };
    case 0x82:
      return {
        instruction: "add",
        from: "D",
      };
    case 0x83:
      return {
        instruction: "add",
        from: "E",
      };
    case 0x84:
      return {
        instruction: "add",
        from: "H",
      };
    case 0x85:
      return {
        instruction: "add",
        from: "L",
      };
    case 0x86:
      return {
        instruction: "add",
        from: "(HL)",
      };
    case 0x87:
      return {
        instruction: "add",
        from: "A",
      };
    case 0x88:
      return {
        instruction: "addCarry",
        from: "B",
      };
    case 0x89:
      return {
        instruction: "addCarry",
        from: "C",
      };
    case 0x8a:
      return {
        instruction: "addCarry",
        from: "D",
      };
    case 0x8b:
      return {
        instruction: "addCarry",
        from: "E",
      };
    case 0x8c:
      return {
        instruction: "addCarry",
        from: "H",
      };
    case 0x8d:
      return {
        instruction: "addCarry",
        from: "L",
      };
    case 0x8e:
      return {
        instruction: "addCarry",
        from: "(HL)",
      };
    case 0x8f:
      return {
        instruction: "addCarry",
        from: "A",
      };
    case 0x90:
      return {
        instruction: "subtract",
        from: "B",
      };
    case 0x91:
      return {
        instruction: "subtract",
        from: "C",
      };
    case 0x92:
      return {
        instruction: "subtract",
        from: "D",
      };
    case 0x93:
      return {
        instruction: "subtract",
        from: "E",
      };
    case 0x94:
      return {
        instruction: "subtract",
        from: "H",
      };
    case 0x95:
      return {
        instruction: "subtract",
        from: "L",
      };
    case 0x96:
      return {
        instruction: "subtract",
        from: "(HL)",
      };
    case 0x97:
      return {
        instruction: "subtract",
        from: "A",
      };
    case 0x98:
      return {
        instruction: "subtractCarry",
        from: "B",
      };
    case 0x99:
      return {
        instruction: "subtractCarry",
        from: "C",
      };
    case 0x9a:
      return {
        instruction: "subtractCarry",
        from: "D",
      };
    case 0x9b:
      return {
        instruction: "subtractCarry",
        from: "E",
      };
    case 0x9c:
      return {
        instruction: "subtractCarry",
        from: "H",
      };
    case 0x9d:
      return {
        instruction: "subtractCarry",
        from: "L",
      };
    case 0x9e:
      return {
        instruction: "subtractCarry",
        from: "(HL)",
      };
    case 0x9f:
      return {
        instruction: "subtractCarry",
        from: "A",
      };
    case 0xa0:
      return {
        instruction: "and",
        from: "B",
      };
    case 0xa1:
      return {
        instruction: "and",
        from: "C",
      };
    case 0xa2:
      return {
        instruction: "and",
        from: "D",
      };
    case 0xa3:
      return {
        instruction: "and",
        from: "E",
      };
    case 0xa4:
      return {
        instruction: "and",
        from: "H",
      };
    case 0xa5:
      return {
        instruction: "and",
        from: "L",
      };
    case 0xa6:
      return {
        instruction: "and",
        from: "(HL)",
      };
    case 0xa7:
      return {
        instruction: "and",
        from: "A",
      };
    case 0xa8:
      return {
        instruction: "xor",
        from: "B",
      };
    case 0xa9:
      return {
        instruction: "xor",
        from: "C",
      };
    case 0xaa:
      return {
        instruction: "xor",
        from: "D",
      };
    case 0xab:
      return {
        instruction: "xor",
        from: "E",
      };
    case 0xac:
      return {
        instruction: "xor",
        from: "H",
      };
    case 0xad:
      return {
        instruction: "xor",
        from: "L",
      };
    case 0xae:
      return {
        instruction: "xor",
        from: "(HL)",
      };
    case 0xaf:
      return {
        instruction: "xor",
        from: "A",
      };
    case 0xb0:
      return {
        instruction: "or",
        from: "B",
      };
    case 0xb1:
      return {
        instruction: "or",
        from: "C",
      };
    case 0xb2:
      return {
        instruction: "or",
        from: "D",
      };
    case 0xb3:
      return {
        instruction: "or",
        from: "E",
      };
    case 0xb4:
      return {
        instruction: "or",
        from: "H",
      };
    case 0xb5:
      return {
        instruction: "or",
        from: "L",
      };
    case 0xb6:
      return {
        instruction: "or",
        from: "(HL)",
      };
    case 0xb7:
      return {
        instruction: "or",
        from: "A",
      };
    case 0xb8:
      return {
        instruction: "cp",
        from: "B",
      };
    case 0xb9:
      return {
        instruction: "cp",
        from: "C",
      };
    case 0xba:
      return {
        instruction: "cp",
        from: "D",
      };
    case 0xbb:
      return {
        instruction: "cp",
        from: "E",
      };
    case 0xbc:
      return {
        instruction: "cp",
        from: "H",
      };
    case 0xbd:
      return {
        instruction: "cp",
        from: "L",
      };
    case 0xbe:
      return {
        instruction: "cp",
        from: "(HL)",
      };
    case 0xbf:
      return {
        instruction: "cp",
        from: "A",
      };
    case 0xc0:
      return {
        instruction: "return",
        condition: "NZ",
      };
    case 0xc1:
      return {
        instruction: "pop",
        to: "BC",
      };
    case 0xc2:
      return {
        instruction: "jump",
        condition: "NZ",
      };
    case 0xc3:
      return {
        instruction: "jump",
        condition: "always",
      };
    case 0xc4:
      return {
        instruction: "call",
        condition: "NZ",
      };
    case 0xc5:
      return {
        instruction: "push",
        to: "BC",
      };
    case 0xc6:
      return {
        instruction: "add",
        from: "immediate",
      };
    case 0xc7:
      return {
        instruction: "restart",
        to: 0x0,
      };
    case 0xc8:
      return {
        instruction: "return",
        condition: "Z",
      };
    case 0xc9:
      return {
        instruction: "return",
        condition: "always",
      };
    case 0xca:
      return {
        instruction: "jump",
        condition: "Z",
      };
    case 0xcb:
      return "extended";
    case 0xcc:
      return {
        instruction: "call",
        condition: "Z",
      };
    case 0xcd:
      return {
        instruction: "call",
        condition: "always",
      };
    case 0xce:
      return {
        instruction: "addCarry",
        from: "immediate",
      };
    case 0xcf:
      return {
        instruction: "restart",
        to: 0x08,
      };
    case 0xd0:
      return {
        instruction: "return",
        condition: "NC",
      };
    case 0xd1:
      return {
        instruction: "pop",
        to: "DE",
      };
    case 0xd2:
      return {
        instruction: "jump",
        condition: "NC",
      };
    case 0xd3:
      throw new Error("Invalid opcode");
    case 0xd4:
      return {
        instruction: "call",
        condition: "NC",
      };
    case 0xd5:
      return {
        instruction: "push",
        to: "DE",
      };
    case 0xd6:
      return {
        instruction: "subtract",
        from: "immediate",
      };
    case 0xd7:
      return {
        instruction: "restart",
        to: 0x10,
      };
    case 0xd8:
      return {
        instruction: "return",
        condition: "C",
      };
    case 0xd9:
      return {
        instruction: "returnAndEnableInterrupts",
      };
    case 0xda:
      return {
        instruction: "jump",
        condition: "C",
      };
    case 0xdb:
      throw new Error("Invalid opcode");
    case 0xdc:
      return {
        instruction: "call",
        condition: "C",
      };
    case 0xdd:
      throw new Error("Invalid opcode");
    case 0xde:
      return {
        instruction: "subtractCarry",
        from: "immediate",
      };
    case 0xdf:
      return {
        instruction: "restart",
        to: 0x18,
      };
    case 0xe0:
      return {
        instruction: "writeH",
      };
    case 0xe1:
      return {
        instruction: "pop",
        to: "HL",
      };
    case 0xe2:
      return {
        instruction: "writeHC",
      };
    case 0xe3:
      throw new Error("Invalid opcode");
    case 0xe4:
      throw new Error("Invalid opcode");
    case 0xe5:
      return {
        instruction: "push",
        to: "HL",
      };
    case 0xe6:
      return {
        instruction: "and",
        from: "immediate",
      };
    case 0xe7:
      return {
        instruction: "restart",
        to: 0x20,
      };
    case 0xe8:
      return {
        instruction: "addSP",
      };
    case 0xe9:
      return {
        instruction: "jumpHL",
      };
    case 0xea:
      return {
        instruction: "load",
        from: "A",
        to: "(immediate)",
      };
    case 0xeb:
      throw new Error("Invalid opcode");
    case 0xec:
      throw new Error("Invalid opcode");
    case 0xed:
      throw new Error("Invalid opcode");
    case 0xee:
      return {
        instruction: "xor",
        from: "immediate",
      };
    case 0xef:
      return {
        instruction: "restart",
        to: 0x28,
      };
    case 0xf0:
      return {
        instruction: "loadH",
      };
    case 0xf1:
      return {
        instruction: "pop",
        to: "AF",
      };
    case 0xf2:
      return {
        instruction: "loadHC",
      };
    case 0xf3:
      return {
        instruction: "disableInterrupts",
      };
    case 0xf4:
      throw new Error("Invalid opcode");
    case 0xf5:
      return {
        instruction: "push",
        to: "AF",
      };
    case 0xf6:
      return {
        instruction: "or",
        from: "immediate",
      };
    case 0xf7:
      return {
        instruction: "restart",
        to: 0x30,
      };
    case 0xf8:
      return {
        instruction: "loadHLSP",
      };
    case 0xf9:
      return {
        instruction: "loadSPHL",
      };
    case 0xfa:
      return {
        instruction: "load",
        from: "(immediate)",
        to: "A",
      };
    case 0xfb:
      return {
        instruction: "enableInterrupts",
      };
    case 0xfc:
      throw new Error("Invalid opcode");
    case 0xfd:
      throw new Error("Invalid opcode");
    case 0xfe:
      return {
        instruction: "cp",
        from: "immediate",
      };
    case 0xff:
      return {
        instruction: "restart",
        to: 0x38,
      };
  }

  throw new Error("Invalid opcode");
}

function extendedInstructionFromOpcode(opcode: number): Instruction {
  switch (opcode & 0xff) {
    case 0x00:
      return {
        instruction: "rotateLeft",
        to: "B",
      };
    case 0x01:
      return {
        instruction: "rotateLeft",
        to: "C",
      };
    case 0x02:
      return {
        instruction: "rotateLeft",
        to: "D",
      };
    case 0x03:
      return {
        instruction: "rotateLeft",
        to: "E",
      };
    case 0x04:
      return {
        instruction: "rotateLeft",
        to: "H",
      };
    case 0x05:
      return {
        instruction: "rotateLeft",
        to: "L",
      };
    case 0x06:
      return {
        instruction: "rotateLeft",
        to: "(HL)",
      };
    case 0x07:
      return {
        instruction: "rotateLeft",
        to: "A",
      };
    case 0x08:
      return {
        instruction: "rotateRight",
        to: "B",
      };
    case 0x09:
      return {
        instruction: "rotateRight",
        to: "C",
      };
    case 0x0a:
      return {
        instruction: "rotateRight",
        to: "D",
      };
    case 0x0b:
      return {
        instruction: "rotateRight",
        to: "E",
      };
    case 0x0c:
      return {
        instruction: "rotateRight",
        to: "H",
      };
    case 0x0d:
      return {
        instruction: "rotateRight",
        to: "L",
      };
    case 0x0e:
      return {
        instruction: "rotateRight",
        to: "(HL)",
      };
    case 0x0f:
      return {
        instruction: "rotateRight",
        to: "A",
      };
    case 0x10:
      return {
        instruction: "rotateLeftCarry",
        to: "B",
      };
    case 0x11:
      return {
        instruction: "rotateLeftCarry",
        to: "C",
      };
    case 0x12:
      return {
        instruction: "rotateLeftCarry",
        to: "D",
      };
    case 0x13:
      return {
        instruction: "rotateLeftCarry",
        to: "E",
      };
    case 0x14:
      return {
        instruction: "rotateLeftCarry",
        to: "H",
      };
    case 0x15:
      return {
        instruction: "rotateLeftCarry",
        to: "L",
      };
    case 0x16:
      return {
        instruction: "rotateLeftCarry",
        to: "(HL)",
      };
    case 0x17:
      return {
        instruction: "rotateLeftCarry",
        to: "A",
      };
    case 0x18:
      return {
        instruction: "rotateRightCarry",
        to: "B",
      };
    case 0x19:
      return {
        instruction: "rotateRightCarry",
        to: "C",
      };
    case 0x1a:
      return {
        instruction: "rotateRightCarry",
        to: "D",
      };
    case 0x1b:
      return {
        instruction: "rotateRightCarry",
        to: "E",
      };
    case 0x1c:
      return {
        instruction: "rotateRightCarry",
        to: "H",
      };
    case 0x1d:
      return {
        instruction: "rotateRightCarry",
        to: "L",
      };
    case 0x1e:
      return {
        instruction: "rotateRightCarry",
        to: "(HL)",
      };
    case 0x1f:
      return {
        instruction: "rotateRightCarry",
        to: "A",
      };
    case 0x20:
      return {
        instruction: "shiftLeftArithmetic",
        to: "B",
      };
    case 0x21:
      return {
        instruction: "shiftLeftArithmetic",
        to: "C",
      };
    case 0x22:
      return {
        instruction: "shiftLeftArithmetic",
        to: "D",
      };
    case 0x23:
      return {
        instruction: "shiftLeftArithmetic",
        to: "E",
      };
    case 0x24:
      return {
        instruction: "shiftLeftArithmetic",
        to: "H",
      };
    case 0x25:
      return {
        instruction: "shiftLeftArithmetic",
        to: "L",
      };
    case 0x26:
      return {
        instruction: "shiftLeftArithmetic",
        to: "(HL)",
      };
    case 0x27:
      return {
        instruction: "shiftLeftArithmetic",
        to: "A",
      };
    case 0x28:
      return {
        instruction: "shiftRightArithmetic",
        to: "B",
      };
    case 0x29:
      return {
        instruction: "shiftRightArithmetic",
        to: "C",
      };
    case 0x2a:
      return {
        instruction: "shiftRightArithmetic",
        to: "D",
      };
    case 0x2b:
      return {
        instruction: "shiftRightArithmetic",
        to: "E",
      };
    case 0x2c:
      return {
        instruction: "shiftRightArithmetic",
        to: "H",
      };
    case 0x2d:
      return {
        instruction: "shiftRightArithmetic",
        to: "L",
      };
    case 0x2e:
      return {
        instruction: "shiftRightArithmetic",
        to: "(HL)",
      };
    case 0x2f:
      return {
        instruction: "shiftRightArithmetic",
        to: "A",
      };
    case 0x30:
      return {
        instruction: "swap",
        to: "B",
      };
    case 0x31:
      return {
        instruction: "swap",
        to: "C",
      };
    case 0x32:
      return {
        instruction: "swap",
        to: "D",
      };
    case 0x33:
      return {
        instruction: "swap",
        to: "E",
      };
    case 0x34:
      return {
        instruction: "swap",
        to: "H",
      };
    case 0x35:
      return {
        instruction: "swap",
        to: "L",
      };
    case 0x36:
      return {
        instruction: "swap",
        to: "(HL)",
      };
    case 0x37:
      return {
        instruction: "swap",
        to: "A",
      };
    case 0x38:
      return {
        instruction: "shiftRightLogic",
        to: "B",
      };
    case 0x39:
      return {
        instruction: "shiftRightLogic",
        to: "C",
      };
    case 0x3a:
      return {
        instruction: "shiftRightLogic",
        to: "D",
      };
    case 0x3b:
      return {
        instruction: "shiftRightLogic",
        to: "E",
      };
    case 0x3c:
      return {
        instruction: "shiftRightLogic",
        to: "H",
      };
    case 0x3d:
      return {
        instruction: "shiftRightLogic",
        to: "L",
      };
    case 0x3e:
      return {
        instruction: "shiftRightLogic",
        to: "(HL)",
      };
    case 0x3f:
      return {
        instruction: "shiftRightLogic",
        to: "A",
      };
    case 0x40:
      return {
        instruction: "testBit",
        bit: 0,
        to: "B",
      };
    case 0x41:
      return {
        instruction: "testBit",
        bit: 0,
        to: "C",
      };
    case 0x42:
      return {
        instruction: "testBit",
        bit: 0,
        to: "D",
      };
    case 0x43:
      return {
        instruction: "testBit",
        bit: 0,
        to: "E",
      };
    case 0x44:
      return {
        instruction: "testBit",
        bit: 0,
        to: "H",
      };
    case 0x45:
      return {
        instruction: "testBit",
        bit: 0,
        to: "L",
      };
    case 0x46:
      return {
        instruction: "testBit",
        bit: 0,
        to: "(HL)",
      };
    case 0x47:
      return {
        instruction: "testBit",
        bit: 0,
        to: "A",
      };
    case 0x48:
      return {
        instruction: "testBit",
        bit: 1,
        to: "B",
      };
    case 0x49:
      return {
        instruction: "testBit",
        bit: 1,
        to: "C",
      };
    case 0x4a:
      return {
        instruction: "testBit",
        bit: 1,
        to: "D",
      };
    case 0x4b:
      return {
        instruction: "testBit",
        bit: 1,
        to: "E",
      };
    case 0x4c:
      return {
        instruction: "testBit",
        bit: 1,
        to: "H",
      };
    case 0x4d:
      return {
        instruction: "testBit",
        bit: 1,
        to: "L",
      };
    case 0x4e:
      return {
        instruction: "testBit",
        bit: 1,
        to: "(HL)",
      };
    case 0x4f:
      return {
        instruction: "testBit",
        bit: 1,
        to: "A",
      };
    case 0x50:
      return {
        instruction: "testBit",
        bit: 2,
        to: "B",
      };
    case 0x51:
      return {
        instruction: "testBit",
        bit: 2,
        to: "C",
      };
    case 0x52:
      return {
        instruction: "testBit",
        bit: 2,
        to: "D",
      };
    case 0x53:
      return {
        instruction: "testBit",
        bit: 2,
        to: "E",
      };
    case 0x54:
      return {
        instruction: "testBit",
        bit: 2,
        to: "H",
      };
    case 0x55:
      return {
        instruction: "testBit",
        bit: 2,
        to: "L",
      };
    case 0x56:
      return {
        instruction: "testBit",
        bit: 2,
        to: "(HL)",
      };
    case 0x57:
      return {
        instruction: "testBit",
        bit: 2,
        to: "A",
      };
    case 0x58:
      return {
        instruction: "testBit",
        bit: 3,
        to: "B",
      };
    case 0x59:
      return {
        instruction: "testBit",
        bit: 3,
        to: "C",
      };
    case 0x5a:
      return {
        instruction: "testBit",
        bit: 3,
        to: "D",
      };
    case 0x5b:
      return {
        instruction: "testBit",
        bit: 3,
        to: "E",
      };
    case 0x5c:
      return {
        instruction: "testBit",
        bit: 3,
        to: "H",
      };
    case 0x5d:
      return {
        instruction: "testBit",
        bit: 3,
        to: "L",
      };
    case 0x5e:
      return {
        instruction: "testBit",
        bit: 3,
        to: "(HL)",
      };
    case 0x5f:
      return {
        instruction: "testBit",
        bit: 3,
        to: "A",
      };
    case 0x60:
      return {
        instruction: "testBit",
        bit: 4,
        to: "B",
      };
    case 0x61:
      return {
        instruction: "testBit",
        bit: 4,
        to: "C",
      };
    case 0x62:
      return {
        instruction: "testBit",
        bit: 4,
        to: "D",
      };
    case 0x63:
      return {
        instruction: "testBit",
        bit: 4,
        to: "E",
      };
    case 0x64:
      return {
        instruction: "testBit",
        bit: 4,
        to: "H",
      };
    case 0x65:
      return {
        instruction: "testBit",
        bit: 4,
        to: "L",
      };
    case 0x66:
      return {
        instruction: "testBit",
        bit: 4,
        to: "(HL)",
      };
    case 0x67:
      return {
        instruction: "testBit",
        bit: 4,
        to: "A",
      };
    case 0x68:
      return {
        instruction: "testBit",
        bit: 5,
        to: "B",
      };
    case 0x69:
      return {
        instruction: "testBit",
        bit: 5,
        to: "C",
      };
    case 0x6a:
      return {
        instruction: "testBit",
        bit: 5,
        to: "D",
      };
    case 0x6b:
      return {
        instruction: "testBit",
        bit: 5,
        to: "E",
      };
    case 0x6c:
      return {
        instruction: "testBit",
        bit: 5,
        to: "H",
      };
    case 0x6d:
      return {
        instruction: "testBit",
        bit: 5,
        to: "L",
      };
    case 0x6e:
      return {
        instruction: "testBit",
        bit: 5,
        to: "(HL)",
      };
    case 0x6f:
      return {
        instruction: "testBit",
        bit: 5,
        to: "A",
      };
    case 0x70:
      return {
        instruction: "testBit",
        bit: 6,
        to: "B",
      };
    case 0x71:
      return {
        instruction: "testBit",
        bit: 6,
        to: "C",
      };
    case 0x72:
      return {
        instruction: "testBit",
        bit: 6,
        to: "D",
      };
    case 0x73:
      return {
        instruction: "testBit",
        bit: 6,
        to: "E",
      };
    case 0x74:
      return {
        instruction: "testBit",
        bit: 6,
        to: "H",
      };
    case 0x75:
      return {
        instruction: "testBit",
        bit: 6,
        to: "L",
      };
    case 0x76:
      return {
        instruction: "testBit",
        bit: 6,
        to: "(HL)",
      };
    case 0x77:
      return {
        instruction: "testBit",
        bit: 6,
        to: "A",
      };
    case 0x78:
      return {
        instruction: "testBit",
        bit: 7,
        to: "B",
      };
    case 0x79:
      return {
        instruction: "testBit",
        bit: 7,
        to: "C",
      };
    case 0x7a:
      return {
        instruction: "testBit",
        bit: 7,
        to: "D",
      };
    case 0x7b:
      return {
        instruction: "testBit",
        bit: 7,
        to: "E",
      };
    case 0x7c:
      return {
        instruction: "testBit",
        bit: 7,
        to: "H",
      };
    case 0x7d:
      return {
        instruction: "testBit",
        bit: 7,
        to: "L",
      };
    case 0x7e:
      return {
        instruction: "testBit",
        bit: 7,
        to: "(HL)",
      };
    case 0x7f:
      return {
        instruction: "testBit",
        bit: 7,
        to: "A",
      };
    case 0x80:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "B",
      };
    case 0x81:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "C",
      };
    case 0x82:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "D",
      };
    case 0x83:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "E",
      };
    case 0x84:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "H",
      };
    case 0x85:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "L",
      };
    case 0x86:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "(HL)",
      };
    case 0x87:
      return {
        instruction: "resetBit",
        bit: 0,
        to: "A",
      };
    case 0x88:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "B",
      };
    case 0x89:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "C",
      };
    case 0x8a:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "D",
      };
    case 0x8b:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "E",
      };
    case 0x8c:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "H",
      };
    case 0x8d:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "L",
      };
    case 0x8e:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "(HL)",
      };
    case 0x8f:
      return {
        instruction: "resetBit",
        bit: 1,
        to: "A",
      };
    case 0x90:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "B",
      };
    case 0x91:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "C",
      };
    case 0x92:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "D",
      };
    case 0x93:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "E",
      };
    case 0x94:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "H",
      };
    case 0x95:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "L",
      };
    case 0x96:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "(HL)",
      };
    case 0x97:
      return {
        instruction: "resetBit",
        bit: 2,
        to: "A",
      };
    case 0x98:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "B",
      };
    case 0x99:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "C",
      };
    case 0x9a:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "D",
      };
    case 0x9b:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "E",
      };
    case 0x9c:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "H",
      };
    case 0x9d:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "L",
      };
    case 0x9e:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "(HL)",
      };
    case 0x9f:
      return {
        instruction: "resetBit",
        bit: 3,
        to: "A",
      };
    case 0xa0:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "B",
      };
    case 0xa1:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "C",
      };
    case 0xa2:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "D",
      };
    case 0xa3:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "E",
      };
    case 0xa4:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "H",
      };
    case 0xa5:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "L",
      };
    case 0xa6:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "(HL)",
      };
    case 0xa7:
      return {
        instruction: "resetBit",
        bit: 4,
        to: "A",
      };
    case 0xa8:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "B",
      };
    case 0xa9:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "C",
      };
    case 0xaa:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "D",
      };
    case 0xab:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "E",
      };
    case 0xac:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "H",
      };
    case 0xad:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "L",
      };
    case 0xae:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "(HL)",
      };
    case 0xaf:
      return {
        instruction: "resetBit",
        bit: 5,
        to: "A",
      };
    case 0xb0:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "B",
      };
    case 0xb1:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "C",
      };
    case 0xb2:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "D",
      };
    case 0xb3:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "E",
      };
    case 0xb4:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "H",
      };
    case 0xb5:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "L",
      };
    case 0xb6:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "(HL)",
      };
    case 0xb7:
      return {
        instruction: "resetBit",
        bit: 6,
        to: "A",
      };
    case 0xb8:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "B",
      };
    case 0xb9:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "C",
      };
    case 0xba:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "D",
      };
    case 0xbb:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "E",
      };
    case 0xbc:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "H",
      };
    case 0xbd:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "L",
      };
    case 0xbe:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "(HL)",
      };
    case 0xbf:
      return {
        instruction: "resetBit",
        bit: 7,
        to: "A",
      };
    case 0xc0:
      return {
        instruction: "setBit",
        bit: 0,
        to: "B",
      };
    case 0xc1:
      return {
        instruction: "setBit",
        bit: 0,
        to: "C",
      };
    case 0xc2:
      return {
        instruction: "setBit",
        bit: 0,
        to: "D",
      };
    case 0xc3:
      return {
        instruction: "setBit",
        bit: 0,
        to: "E",
      };
    case 0xc4:
      return {
        instruction: "setBit",
        bit: 0,
        to: "H",
      };
    case 0xc5:
      return {
        instruction: "setBit",
        bit: 0,
        to: "L",
      };
    case 0xc6:
      return {
        instruction: "setBit",
        bit: 0,
        to: "(HL)",
      };
    case 0xc7:
      return {
        instruction: "setBit",
        bit: 0,
        to: "A",
      };
    case 0xc8:
      return {
        instruction: "setBit",
        bit: 1,
        to: "B",
      };
    case 0xc9:
      return {
        instruction: "setBit",
        bit: 1,
        to: "C",
      };
    case 0xca:
      return {
        instruction: "setBit",
        bit: 1,
        to: "D",
      };
    case 0xcb:
      return {
        instruction: "setBit",
        bit: 1,
        to: "E",
      };
    case 0xcc:
      return {
        instruction: "setBit",
        bit: 1,
        to: "H",
      };
    case 0xcd:
      return {
        instruction: "setBit",
        bit: 1,
        to: "L",
      };
    case 0xce:
      return {
        instruction: "setBit",
        bit: 1,
        to: "(HL)",
      };
    case 0xcf:
      return {
        instruction: "setBit",
        bit: 1,
        to: "A",
      };
    case 0xd0:
      return {
        instruction: "setBit",
        bit: 2,
        to: "B",
      };
    case 0xd1:
      return {
        instruction: "setBit",
        bit: 2,
        to: "C",
      };
    case 0xd2:
      return {
        instruction: "setBit",
        bit: 2,
        to: "D",
      };
    case 0xd3:
      return {
        instruction: "setBit",
        bit: 2,
        to: "E",
      };
    case 0xd4:
      return {
        instruction: "setBit",
        bit: 2,
        to: "H",
      };
    case 0xd5:
      return {
        instruction: "setBit",
        bit: 2,
        to: "L",
      };
    case 0xd6:
      return {
        instruction: "setBit",
        bit: 2,
        to: "(HL)",
      };
    case 0xd7:
      return {
        instruction: "setBit",
        bit: 2,
        to: "A",
      };
    case 0xd8:
      return {
        instruction: "setBit",
        bit: 3,
        to: "B",
      };
    case 0xd9:
      return {
        instruction: "setBit",
        bit: 3,
        to: "C",
      };
    case 0xda:
      return {
        instruction: "setBit",
        bit: 3,
        to: "D",
      };
    case 0xdb:
      return {
        instruction: "setBit",
        bit: 3,
        to: "E",
      };
    case 0xdc:
      return {
        instruction: "setBit",
        bit: 3,
        to: "H",
      };
    case 0xdd:
      return {
        instruction: "setBit",
        bit: 3,
        to: "L",
      };
    case 0xde:
      return {
        instruction: "setBit",
        bit: 3,
        to: "(HL)",
      };
    case 0xdf:
      return {
        instruction: "setBit",
        bit: 3,
        to: "A",
      };
    case 0xe0:
      return {
        instruction: "setBit",
        bit: 4,
        to: "B",
      };
    case 0xe1:
      return {
        instruction: "setBit",
        bit: 4,
        to: "C",
      };
    case 0xe2:
      return {
        instruction: "setBit",
        bit: 4,
        to: "D",
      };
    case 0xe3:
      return {
        instruction: "setBit",
        bit: 4,
        to: "E",
      };
    case 0xe4:
      return {
        instruction: "setBit",
        bit: 4,
        to: "H",
      };
    case 0xe5:
      return {
        instruction: "setBit",
        bit: 4,
        to: "L",
      };
    case 0xe6:
      return {
        instruction: "setBit",
        bit: 4,
        to: "(HL)",
      };
    case 0xe7:
      return {
        instruction: "setBit",
        bit: 4,
        to: "A",
      };
    case 0xe8:
      return {
        instruction: "setBit",
        bit: 5,
        to: "B",
      };
    case 0xe9:
      return {
        instruction: "setBit",
        bit: 5,
        to: "C",
      };
    case 0xea:
      return {
        instruction: "setBit",
        bit: 5,
        to: "D",
      };
    case 0xeb:
      return {
        instruction: "setBit",
        bit: 5,
        to: "E",
      };
    case 0xec:
      return {
        instruction: "setBit",
        bit: 5,
        to: "H",
      };
    case 0xed:
      return {
        instruction: "setBit",
        bit: 5,
        to: "L",
      };
    case 0xee:
      return {
        instruction: "setBit",
        bit: 5,
        to: "(HL)",
      };
    case 0xef:
      return {
        instruction: "setBit",
        bit: 5,
        to: "A",
      };
    case 0xf0:
      return {
        instruction: "setBit",
        bit: 6,
        to: "B",
      };
    case 0xf1:
      return {
        instruction: "setBit",
        bit: 6,
        to: "C",
      };
    case 0xf2:
      return {
        instruction: "setBit",
        bit: 6,
        to: "D",
      };
    case 0xf3:
      return {
        instruction: "setBit",
        bit: 6,
        to: "E",
      };
    case 0xf4:
      return {
        instruction: "setBit",
        bit: 6,
        to: "H",
      };
    case 0xf5:
      return {
        instruction: "setBit",
        bit: 6,
        to: "L",
      };
    case 0xf6:
      return {
        instruction: "setBit",
        bit: 6,
        to: "(HL)",
      };
    case 0xf7:
      return {
        instruction: "setBit",
        bit: 6,
        to: "A",
      };
    case 0xf8:
      return {
        instruction: "setBit",
        bit: 7,
        to: "B",
      };
    case 0xf9:
      return {
        instruction: "setBit",
        bit: 7,
        to: "C",
      };
    case 0xfa:
      return {
        instruction: "setBit",
        bit: 7,
        to: "D",
      };
    case 0xfb:
      return {
        instruction: "setBit",
        bit: 7,
        to: "E",
      };
    case 0xfc:
      return {
        instruction: "setBit",
        bit: 7,
        to: "H",
      };
    case 0xfd:
      return {
        instruction: "setBit",
        bit: 7,
        to: "L",
      };
    case 0xfe:
      return {
        instruction: "setBit",
        bit: 7,
        to: "(HL)",
      };
    case 0xff:
      return {
        instruction: "setBit",
        bit: 7,
        to: "A",
      };
  }

  throw new Error("Invalid opcode");
}

export function decodeOpcode(
  opcode: number,
  extended: false
): Instruction | "extended";
export function decodeOpcode(opcode: number, extended: true): Instruction;
export function decodeOpcode(
  opcode: number,
  extended: boolean
): Instruction | "extended" {
  if (extended) {
    return extendedInstructionFromOpcode(opcode);
  }

  return instructionFromOpcode(opcode);
}
