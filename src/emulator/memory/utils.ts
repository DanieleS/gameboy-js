import { Memory } from "./memory";

/**
 * Read a 16-bit LE value from a memory location.
 * @param memory The memory to read from
 * @param address The address to read from
 * @returns A 16-bit value
 */
export function read16(memory: Memory, address: number): number {
  return memory.read(address) | (memory.read(address + 1) << 8);
}

/**
 * Write a 16-bit LE value from a memory location.
 * @param memory The memory to write to
 * @param address The address to write to
 * @param value The value to write
 */
export function write16(memory: Memory, address: number, value: number): void {
  memory.write(address, value & 0xff);
  memory.write(address + 1, value >> 8);
}

/**
 * Read a signed 8-bit value from a memory location.
 * @param memory The memory to read from
 * @param address The address to read from
 * @returns A signed 8-bit value
 */
export function readSigned(memory: Memory, address: number): number {
  // Trick to get a signed 8-bit value
  return (memory.read(address) << 24) >> 24;
}
