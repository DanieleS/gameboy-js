const DUTY_PATTERNS = [0b00000001, 0b10000001, 0b10000111, 0b01111110] as const;

export class SweepPulseChannel {
  enabled = false;
  dacEnabled = false;

  private duty = 0;
  private lengthTimer = 0;
  private lengthEnabled = false;

  private initialVolume = 0;
  private envelopeDirection = 0;
  private envelopePeriod = 0;
  private currentVolume = 0;
  private envelopeTimer = 0;

  private period = 0;
  private shadowPeriod = 0;
  private freqTimer = 0;
  private wavePosition = 0;

  private sweepPace = 0;
  private sweepDirection = 0; // 0=increase, 1=decrease
  private sweepStep = 0;
  private sweepTimer = 0;
  private sweepEnabled = false;

  tick(cycles: number): number {
    if (!this.enabled || !this.dacEnabled) return 0;

    this.freqTimer -= cycles;
    while (this.freqTimer <= 0) {
      this.wavePosition = (this.wavePosition + 1) % 8;
      this.freqTimer += (2048 - this.period) * 4;
    }

    const bit = (DUTY_PATTERNS[this.duty] >> (7 - this.wavePosition)) & 1;
    return bit * this.currentVolume;
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

  tickSweep(): void {
    this.sweepTimer--;
    if (this.sweepTimer > 0) return;

    this.sweepTimer = this.sweepPace !== 0 ? this.sweepPace : 8;

    if (!this.sweepEnabled || this.sweepPace === 0) return;

    const newPeriod = this.calculateSweepPeriod();
    if (newPeriod >= 2048) {
      this.enabled = false;
      return;
    }

    if (this.sweepStep !== 0) {
      this.period = newPeriod;
      this.shadowPeriod = newPeriod;
      // Second overflow check — result not written back
      if (this.calculateSweepPeriod() >= 2048) {
        this.enabled = false;
      }
    }
  }

  private calculateSweepPeriod(): number {
    const delta = this.shadowPeriod >> this.sweepStep;
    return this.sweepDirection === 1
      ? this.shadowPeriod - delta
      : this.shadowPeriod + delta;
  }

  private trigger(): void {
    if (this.dacEnabled) this.enabled = true;
    if (this.lengthTimer === 0) this.lengthTimer = 64;
    this.freqTimer = (2048 - this.period) * 4;
    this.currentVolume = this.initialVolume;
    this.envelopeTimer = this.envelopePeriod;
    this.wavePosition = 0;

    this.shadowPeriod = this.period;
    this.sweepTimer = this.sweepPace !== 0 ? this.sweepPace : 8;
    this.sweepEnabled = this.sweepPace !== 0 || this.sweepStep !== 0;
    if (this.sweepStep !== 0 && this.calculateSweepPeriod() >= 2048) {
      this.enabled = false;
    }
  }

  writeNR10(value: number): void {
    this.sweepPace = (value >> 4) & 0x7;
    this.sweepDirection = (value >> 3) & 0x1;
    this.sweepStep = value & 0x7;
  }

  writeNR11(value: number): void {
    this.duty = (value >> 6) & 0x3;
    this.lengthTimer = 64 - (value & 0x3f);
  }

  writeNR12(value: number): void {
    this.initialVolume = (value >> 4) & 0xf;
    this.envelopeDirection = (value >> 3) & 0x1;
    this.envelopePeriod = value & 0x7;
    this.dacEnabled = (value & 0xf8) !== 0;
    if (!this.dacEnabled) this.enabled = false;
  }

  writeNR13(value: number): void {
    this.period = (this.period & 0x700) | (value & 0xff);
  }

  writeNR14(value: number): void {
    this.period = (this.period & 0xff) | ((value & 0x7) << 8);
    this.lengthEnabled = (value & 0x40) !== 0;
    if (value & 0x80) this.trigger();
  }

  // Unused bits read back as 1 per Pan Docs
  readNR10(): number {
    return (
      ((this.sweepPace & 0x7) << 4) |
      ((this.sweepDirection & 0x1) << 3) |
      (this.sweepStep & 0x7) |
      0x80
    );
  }

  readNR11(): number {
    return ((this.duty & 0x3) << 6) | 0x3f;
  }

  readNR12(): number {
    return (
      ((this.initialVolume & 0xf) << 4) |
      ((this.envelopeDirection & 0x1) << 3) |
      (this.envelopePeriod & 0x7)
    );
  }

  readNR14(): number {
    return (this.lengthEnabled ? 0x40 : 0) | 0xbf;
  }
}
