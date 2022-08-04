import { Memory } from "../memory/memory";

const interruptEnabledAddress = 0xffff;
const interruptRequestedAddress = 0xff0f;

export const enum Interrupt {
  VBlank = 0x1,
  LCDStat = 0x2,
  Timer = 0x4,
  Serial = 0x8,
  Joypad = 0x10,
}

const interruptAddress = {
  [Interrupt.VBlank]: 0x40,
  [Interrupt.LCDStat]: 0x48,
  [Interrupt.Timer]: 0x50,
  [Interrupt.Serial]: 0x58,
  [Interrupt.Joypad]: 0x60,
} as const;

export function isInterruptActive(
  memory: Memory,
  interrupt: Interrupt
): boolean {
  const requested = memory.read(interruptRequestedAddress);
  const enabled = memory.read(interruptEnabledAddress);
  return (requested & enabled & interrupt) !== 0;
}

export function requestInterrupt(memory: Memory, interrupt: Interrupt): void {
  const interrupts = memory.read(interruptRequestedAddress);
  memory.write(interruptRequestedAddress, interrupts | interrupt);
}

export function getHighestPriorityInterrupt(memory: Memory): Interrupt | null {
  return (
    [
      Interrupt.VBlank,
      Interrupt.LCDStat,
      Interrupt.Timer,
      Interrupt.Serial,
      Interrupt.Joypad,
    ].find((interrupt) => isInterruptActive(memory, interrupt)) ?? null
  );
}

export function acknowledgeInterrupt(
  memory: Memory,
  interrupt: Interrupt
): void {
  const interrupts = memory.read(interruptRequestedAddress);
  memory.write(interruptRequestedAddress, interrupts & ~interrupt);
}

export function isEmpty(memory: Memory): boolean {
  return memory.read(interruptRequestedAddress) === 0;
}

export function getInterruptAddress(interrupt: Interrupt) {
  return interruptAddress[interrupt];
}
