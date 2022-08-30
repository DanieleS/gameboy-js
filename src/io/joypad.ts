import { Emulator } from "../emulator/emulator";
import { JoypadButton } from "../emulator/joypad";

export function registerJoypadHandlers(emulator: Emulator) {
  window.addEventListener(
    "keydown",
    buttonHandler((button) => emulator.sendJoypadButtonDown(button))
  );
  window.addEventListener(
    "keyup",
    buttonHandler((button) => emulator.sendJoypadButtonUp(button))
  );

  window.addEventListener(
    "touchstart",
    touchButtonHandler((button) => {
      navigator.vibrate?.(50);
      emulator.sendJoypadButtonDown(button);
    })
  );
  window.addEventListener(
    "touchend",
    touchButtonHandler((button) => emulator.sendJoypadButtonUp(button))
  );
}

function buttonHandler(
  onMatch: (button: JoypadButton) => void
): (e: KeyboardEvent) => void {
  return (e) => {
    const keyButtonsMap: Record<string, JoypadButton | undefined> = {
      ArrowUp: JoypadButton.Up,
      ArrowDown: JoypadButton.Down,
      ArrowLeft: JoypadButton.Left,
      ArrowRight: JoypadButton.Right,
      KeyA: JoypadButton.A,
      KeyS: JoypadButton.B,
      Enter: JoypadButton.Start,
      Backspace: JoypadButton.Select,
    };
    const button = keyButtonsMap[e.code];

    if (typeof button !== "undefined") {
      onMatch(button);
    }
  };
}

function touchButtonHandler(
  onMatch: (button: JoypadButton) => void
): (e: TouchEvent) => void {
  return (e) => {
    const target = e.target;
    if (
      target instanceof HTMLButtonElement &&
      target.matches("[data-gameboy-button]")
    ) {
      onMatch(target.dataset.gameboyButton as JoypadButton);
    }
  };
}
