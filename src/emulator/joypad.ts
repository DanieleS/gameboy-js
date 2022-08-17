import { Memory } from "./memory/memory";

const joypadStateAddress = 0xff00;

export const enum JoypadButton {
  A,
  B,
  Select,
  Start,
  Up,
  Down,
  Left,
  Right,
}

export class Joypad {
  buttons: Set<JoypadButton> = new Set();

  setKeyDown(key: JoypadButton) {
    this.buttons.add(key);
  }

  setKeyUp(key: JoypadButton) {
    this.buttons.delete(key);
  }

  updateMemory(memory: Memory) {
    const newState = this.getNewState(memory);
    memory.write(joypadStateAddress, newState);
  }

  private getNewState(memory: Memory) {
    const joypadState = memory.read(joypadStateAddress);
    if ((~joypadState & 0b0010_0000) != 0) {
      // Action buttons
      let pressedButtons = 0b0000_1111;
      if (this.buttons.has(JoypadButton.A)) {
        pressedButtons &= 0b1110;
      }
      if (this.buttons.has(JoypadButton.B)) {
        pressedButtons &= 0b1101;
      }
      if (this.buttons.has(JoypadButton.Select)) {
        pressedButtons &= 0b1011;
      }
      if (this.buttons.has(JoypadButton.Start)) {
        pressedButtons &= 0b0111;
      }
      return pressedButtons;
    } else {
      // Directional buttons
      let pressedButtons = 0b0000_1111;
      if (this.buttons.has(JoypadButton.Right)) {
        pressedButtons &= 0b1110;
      }
      if (this.buttons.has(JoypadButton.Left)) {
        pressedButtons &= 0b1101;
      }
      if (this.buttons.has(JoypadButton.Up)) {
        pressedButtons &= 0b1011;
      }
      if (this.buttons.has(JoypadButton.Down)) {
        pressedButtons &= 0b0111;
      }
      return pressedButtons;
    }
  }
}
