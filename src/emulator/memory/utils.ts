import { unsignedToSignedByte } from "../cpu/math";
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
  return unsignedToSignedByte(memory.read(address));
}

/**
 * Read n bytes from memory starting at address.
 * @param memory The memory to read from
 * @param address The address to read from
 * @param n The number of bytes to read
 * @returns An array of n bytes
 */
export function readBytes(
  memory: Memory,
  address: number,
  n: number
): Uint8Array {
  const bytes = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    bytes[i] = memory.read(address + i);
  }
  return bytes;
}
