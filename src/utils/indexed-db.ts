import Dexie from "dexie";

export type SaveFile = {
  title: string;
  data: Blob;
};

export class GameboyDatabase extends Dexie {
  saveFiles!: Dexie.Table<SaveFile, string>;

  constructor() {
    super("GameboyDb");

    this.version(1).stores({
      saveFiles: "title",
    });
  }
}
