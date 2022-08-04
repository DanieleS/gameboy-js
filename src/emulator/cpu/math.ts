export function overflowingAdd(
  a: number,
  b: number
): [result: number, carry: boolean] {
  const result = a + b;
  return [result & 0xff, result > 0xff];
}

export function overflowingSub(
  a: number,
  b: number
): [result: number, carry: boolean] {
  const result = a - b;
  return [result & 0xff, result < 0];
}

export function wrappingAdd(a: number, b: number): number {
  return (a + b) & 0xff;
}

export function wrappingSub(a: number, b: number): number {
  return (a - b) & 0xff;
}

export function wrappingAdd16(a: number, b: number): number {
  return (a + b) & 0xffff;
}

export function wrappingSub16(a: number, b: number): number {
  return (a - b) & 0xffff;
}

export function rotateLeft(x: number, n: number): number {
  return ((x << n) | (x >> (8 - n))) & 0xff;
}

export function rotateRight(x: number, n: number): number {
  return ((x >> n) | (x << (8 - n))) & 0xff;
}

function activateRightmostZeros(x: number): number {
  return x | wrappingSub16(x, 1);
}

export function testAddCarryBit(bit: number, a: number, b: number): boolean {
  const mask = activateRightmostZeros(1 << bit);
  return (a & mask) + (b & mask) > mask;
}

export function unsignedToSignedByte(x: number): number {
  // Trick to get a signed 8-bit value
  return (x << 24) >> 24;
}
