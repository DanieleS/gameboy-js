const WAVE_POSITIONS = 32;

export class WaveChannel {
  enabled = false;
  dacEnabled = false;

  private lengthTimer = 0;
  private outputLevel = 0;
  private period = 0;
  private lengthEnabled = false;

  private freqTimer = 0;
  private wavePosition = 0;
  private waveRam = new Uint8Array(16);

  tick(cycles: number): number {
    if (!this.enabled || !this.dacEnabled) return 0;

    this.freqTimer -= cycles;
    while (this.freqTimer <= 0) {
      this.wavePosition = (this.wavePosition + 1) % WAVE_POSITIONS;
      this.freqTimer += (2048 - this.period) * 2;
    }

    return this.currentSample();
  }

  tickLength(): void {
    if (!this.lengthEnabled || !this.enabled) return;
    this.lengthTimer--;
    if (this.lengthTimer === 0) this.enabled = false;
  }

  private trigger(): void {
    if (this.dacEnabled) this.enabled = true;
    if (this.lengthTimer === 0) this.lengthTimer = 256;
    // 6-cycle delay before first sample is read (HW quirk)
    this.freqTimer = (2048 - this.period) * 2 + 6;
    this.wavePosition = 0;
  }

  private currentSample(): number {
    const byte = this.waveRam[this.wavePosition >> 1];
    const nibble =
      (this.wavePosition & 1) === 0 ? (byte >> 4) & 0xf : byte & 0xf;
    if (this.outputLevel === 0) return 0;
    return nibble >> (this.outputLevel - 1);
  }

  readWaveRam(offset: number): number {
    return this.waveRam[offset];
  }

  writeWaveRam(offset: number, value: number): void {
    this.waveRam[offset] = value;
  }

  writeNR30(value: number): void {
    this.dacEnabled = (value & 0x80) !== 0;
    if (!this.dacEnabled) this.enabled = false;
  }

  writeNR31(value: number): void {
    this.lengthTimer = 256 - (value & 0xff);
  }

  writeNR32(value: number): void {
    this.outputLevel = (value >> 5) & 0x3;
  }

  writeNR33(value: number): void {
    this.period = (this.period & 0x700) | (value & 0xff);
  }

  writeNR34(value: number): void {
    this.period = (this.period & 0xff) | ((value & 0x7) << 8);
    this.lengthEnabled = (value & 0x40) !== 0;
    if (value & 0x80) this.trigger();
  }

  // Unused bits read back as 1 per Pan Docs
  readNR30(): number {
    return (this.dacEnabled ? 0x80 : 0) | 0x7f;
  }

  readNR32(): number {
    return ((this.outputLevel & 0x3) << 5) | 0x9f;
  }

  readNR34(): number {
    return (this.lengthEnabled ? 0x40 : 0) | 0xbf;
  }
}
