export class NoiseChannel {
  enabled = false;
  dacEnabled = false;

  private lengthTimer = 0;
  private lengthEnabled = false;

  private initialVolume = 0;
  private envelopeDirection = 0;
  private envelopePeriod = 0;
  private currentVolume = 0;
  private envelopeTimer = 0;

  private clockShift = 0;
  private lfsrWidth = 0; // 0=15-bit, 1=7-bit
  private clockDivider = 0;

  private freqTimer = 0;
  // All bits set on trigger per Pan Docs
  private lfsr = 0x7fff;

  tick(cycles: number): number {
    if (!this.enabled || !this.dacEnabled) return 0;

    this.freqTimer -= cycles;
    while (this.freqTimer <= 0) {
      this.freqTimer += this.timerPeriod();
      this.tickLFSR();
    }

    // Bit 0 inverted: 0 → output volume, 1 → silence
    return (this.lfsr & 1) === 0 ? this.currentVolume : 0;
  }

  tickLength(): void {
    if (!this.lengthEnabled || !this.enabled) return;
    this.lengthTimer--;
    if (this.lengthTimer === 0) this.enabled = false;
  }

  tickEnvelope(): void {
    if (this.envelopePeriod === 0) return;
    this.envelopeTimer--;
    if (this.envelopeTimer > 0) return;
    this.envelopeTimer = this.envelopePeriod;
    if (this.envelopeDirection === 1 && this.currentVolume < 15) {
      this.currentVolume++;
    } else if (this.envelopeDirection === 0 && this.currentVolume > 0) {
      this.currentVolume--;
    }
  }

  private tickLFSR(): void {
    const xor = (this.lfsr ^ (this.lfsr >> 1)) & 1;
    this.lfsr = (this.lfsr >> 1) | (xor << 14);
    if (this.lfsrWidth === 1) {
      this.lfsr = (this.lfsr & ~(1 << 6)) | (xor << 6);
    }
  }

  private timerPeriod(): number {
    const divisor = this.clockDivider === 0 ? 8 : this.clockDivider * 16;
    return divisor << this.clockShift;
  }

  private trigger(): void {
    if (this.dacEnabled) this.enabled = true;
    if (this.lengthTimer === 0) this.lengthTimer = 64;
    this.freqTimer = this.timerPeriod();
    this.currentVolume = this.initialVolume;
    this.envelopeTimer = this.envelopePeriod;
    this.lfsr = 0x7fff;
  }

  writeNR41(value: number): void {
    this.lengthTimer = 64 - (value & 0x3f);
  }

  writeNR42(value: number): void {
    this.initialVolume = (value >> 4) & 0xf;
    this.envelopeDirection = (value >> 3) & 0x1;
    this.envelopePeriod = value & 0x7;
    this.dacEnabled = (value & 0xf8) !== 0;
    if (!this.dacEnabled) this.enabled = false;
  }

  writeNR43(value: number): void {
    this.clockShift = (value >> 4) & 0xf;
    this.lfsrWidth = (value >> 3) & 0x1;
    this.clockDivider = value & 0x7;
  }

  writeNR44(value: number): void {
    this.lengthEnabled = (value & 0x40) !== 0;
    if (value & 0x80) this.trigger();
  }

  // Unused bits read back as 1 per Pan Docs
  readNR42(): number {
    return (
      ((this.initialVolume & 0xf) << 4) |
      ((this.envelopeDirection & 0x1) << 3) |
      (this.envelopePeriod & 0x7)
    );
  }

  readNR43(): number {
    return (
      ((this.clockShift & 0xf) << 4) |
      ((this.lfsrWidth & 0x1) << 3) |
      (this.clockDivider & 0x7)
    );
  }

  readNR44(): number {
    return (this.lengthEnabled ? 0x40 : 0) | 0xbf;
  }
}
