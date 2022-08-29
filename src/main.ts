import { Emulator } from "./emulator/emulator";
import { JoypadButton } from "./emulator/joypad";
import { createRomUploader } from "./rom-uploader";

const screen = document.getElementById("screen");
const romUploaderRoot = document.getElementById("uploadRom");
const romUploaderInput = document.getElementById(
  "inputRom"
) as HTMLInputElement | null;

if (romUploaderRoot && romUploaderInput) {
  createRomUploader(
    romUploaderRoot,
    romUploaderInput,
    onRomUpload(startEmulator)
  );
}

function onRomUpload(
  onRomDecoded: (rom: Uint8Array) => void
): (file: File) => void {
  return (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => {
      const result = fileReader.result?.valueOf();
      if (result && result instanceof ArrayBuffer) {
        screen?.classList.add("romLoaded");
        const u8Array = new Uint8Array(result);
        onRomDecoded(u8Array);
      }
    };
  };
}

function startEmulator(rom: Uint8Array) {
  const emulator = new Emulator(rom);
  emulator.start();

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
