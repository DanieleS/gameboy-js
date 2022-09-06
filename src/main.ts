import { Emulator } from "./emulator/emulator";
import { createSaveFile } from "./io/database";
import { registerJoypadHandlers } from "./io/joypad";
import { createRenderFrameHandler } from "./io/screen";
import { createRomUploader } from "./rom-uploader";
import { isTouchDevice } from "./utils/dom";

const app = document.getElementById("app");
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

async function startEmulator(rom: Uint8Array) {
  const emulator = new Emulator(rom);

  registerJoypadHandlers(emulator);

  emulator.addEventListener("vsync", createRenderFrameHandler());
  emulator.addEventListener("save", createSaveFile);

  await emulator.start();

  if (app && isTouchDevice) {
    app.requestFullscreen({
      navigationUI: "hide",
    });
  }
}
