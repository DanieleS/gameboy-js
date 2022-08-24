import { Cartridge } from "./cartridge";

export type EmulatorEvent = {
  type: "save";
  data: [cartridge: Cartridge, ram: Uint8Array];
};
