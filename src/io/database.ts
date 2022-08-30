import { Cartridge } from "../emulator/cartridge";
import { GameboyDatabase, SaveFile } from "../utils/indexed-db";

export async function createSaveFile(cartridge: Cartridge, ram: Uint8Array) {
  const saveFile: SaveFile = {
    title: cartridge.id,
    data: new Blob([ram]),
  };

  const db = new GameboyDatabase();
  await db.saveFiles.put(saveFile);
}
