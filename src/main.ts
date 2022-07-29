import { Emulator } from "./emulator/emulator";
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
}
