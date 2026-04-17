// Waveform high bits per duty setting (read MSB-first at wavePosition 0..7)
const DUTY_PATTERNS = [0b00000001, 0b10000001, 0b10000111, 0b01111110] as const;

export class PulseChannel {
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
  private freqTimer = 0;
  private wavePosition = 0;

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

  private trigger(): void {
    if (this.dacEnabled) this.enabled = true;
    if (this.lengthTimer === 0) this.lengthTimer = 64;
    this.freqTimer = (2048 - this.period) * 4;
    this.currentVolume = this.initialVolume;
    this.envelopeTimer = this.envelopePeriod;
    this.wavePosition = 0;
  }

  writeNR21(value: number): void {
    this.duty = (value >> 6) & 0x3;
    this.lengthTimer = 64 - (value & 0x3f);
  }

  writeNR22(value: number): void {
    this.initialVolume = (value >> 4) & 0xf;
    this.envelopeDirection = (value >> 3) & 0x1;
    this.envelopePeriod = value & 0x7;
    this.dacEnabled = (value & 0xf8) !== 0;
    if (!this.dacEnabled) this.enabled = false;
  }

  writeNR23(value: number): void {
    this.period = (this.period & 0x700) | (value & 0xff);
  }

  writeNR24(value: number): void {
    this.period = (this.period & 0xff) | ((value & 0x7) << 8);
    this.lengthEnabled = (value & 0x40) !== 0;
    if (value & 0x80) this.trigger();
  }

  // Unused bits read back as 1 per Pan Docs
  readNR21(): number {
    return ((this.duty & 0x3) << 6) | 0x3f;
  }

  readNR22(): number {
    return (
      ((this.initialVolume & 0xf) << 4) |
      ((this.envelopeDirection & 0x1) << 3) |
      (this.envelopePeriod & 0x7)
    );
  }

  readNR24(): number {
    return (this.lengthEnabled ? 0x40 : 0) | 0xbf;
  }
}
