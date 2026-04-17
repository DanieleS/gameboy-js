import { SweepPulseChannel } from "./ch1";
import { PulseChannel } from "./ch2";
import { WaveChannel } from "./ch3";
import { NoiseChannel } from "./ch4";

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 512;
const GB_CLOCK = 4194304;
const CYCLES_PER_SAMPLE = Math.round(GB_CLOCK / SAMPLE_RATE); // ~95
const FRAME_SEQ_PERIOD = 8192; // 512 Hz

export class APU {
  private ch1 = new SweepPulseChannel();
  private ch2 = new PulseChannel();
  private ch3 = new WaveChannel();
  private ch4 = new NoiseChannel();
  private powered = true;
  private masterVolumeLeft = 7;
  private masterVolumeRight = 7;
  private panning = 0xff;

  private frameSeqTimer = FRAME_SEQ_PERIOD;
  private frameSeqStep = 0;

  private sampleTimer = CYCLES_PER_SAMPLE;
  private buffer = new Float32Array(BUFFER_SIZE * 2); // stereo interleaved
  private bufferPos = 0;

  tick(cycles: number): Float32Array | null {
    if (!this.powered) return null;

    this.frameSeqTimer -= cycles;
    while (this.frameSeqTimer <= 0) {
      this.frameSeqTimer += FRAME_SEQ_PERIOD;
      this.tickFrameSequencer();
    }

    const ch1Sample = this.ch1.tick(cycles);
    const ch2Sample = this.ch2.tick(cycles);
    const ch3Sample = this.ch3.tick(cycles);
    const ch4Sample = this.ch4.tick(cycles);

    this.sampleTimer -= cycles;
    let result: Float32Array | null = null;
    while (this.sampleTimer <= 0) {
      this.sampleTimer += CYCLES_PER_SAMPLE;
      result = this.pushSample(ch1Sample, ch2Sample, ch3Sample, ch4Sample) ?? result;
    }

    return result;
  }

  private tickFrameSequencer(): void {
    if (this.frameSeqStep % 2 === 0) {
      this.ch1.tickLength();
      this.ch2.tickLength();
      this.ch3.tickLength();
      this.ch4.tickLength();
    }
    if (this.frameSeqStep === 2 || this.frameSeqStep === 6) {
      this.ch1.tickSweep();
    }
    if (this.frameSeqStep === 7 || this.frameSeqStep === 3) {
      this.ch1.tickEnvelope();
      this.ch2.tickEnvelope();
      this.ch4.tickEnvelope();
    }
    this.frameSeqStep = (this.frameSeqStep + 1) % 8;
  }

  // Max 4 channels × 15 = 60; normalise to [0, 1]
  private static readonly MAX_OUTPUT = 15 * 4;

  private pushSample(ch1Sample: number, ch2Sample: number, ch3Sample: number, ch4Sample: number): Float32Array | null {
    // NR51: bit 4=CH1L, bit 0=CH1R, bit 5=CH2L, bit 1=CH2R, bit 6=CH3L, bit 2=CH3R, bit 7=CH4L, bit 3=CH4R
    const ch1Left = (this.panning & 0x10) !== 0;
    const ch1Right = (this.panning & 0x01) !== 0;
    const ch2Left = (this.panning & 0x20) !== 0;
    const ch2Right = (this.panning & 0x02) !== 0;
    const ch3Left = (this.panning & 0x40) !== 0;
    const ch3Right = (this.panning & 0x04) !== 0;
    const ch4Left = (this.panning & 0x80) !== 0;
    const ch4Right = (this.panning & 0x08) !== 0;

    const leftSum =
      (ch1Left ? ch1Sample : 0) +
      (ch2Left ? ch2Sample : 0) +
      (ch3Left ? ch3Sample : 0) +
      (ch4Left ? ch4Sample : 0);
    const rightSum =
      (ch1Right ? ch1Sample : 0) +
      (ch2Right ? ch2Sample : 0) +
      (ch3Right ? ch3Sample : 0) +
      (ch4Right ? ch4Sample : 0);

    const left =
      (leftSum / APU.MAX_OUTPUT) * ((this.masterVolumeLeft + 1) / 8);
    const right =
      (rightSum / APU.MAX_OUTPUT) * ((this.masterVolumeRight + 1) / 8);

    this.buffer[this.bufferPos++] = left;
    this.buffer[this.bufferPos++] = right;

    if (this.bufferPos >= this.buffer.length) {
      this.bufferPos = 0;
      return this.buffer.slice();
    }

    return null;
  }

  read(address: number): number {
    if (!this.powered && address !== 0xff26) {
      if (address >= 0xff30 && address <= 0xff3f) {
        return this.ch3.readWaveRam(address - 0xff30);
      }
      return 0xff;
    }

    switch (address) {
      case 0xff10:
        return this.ch1.readNR10();
      case 0xff11:
        return this.ch1.readNR11();
      case 0xff12:
        return this.ch1.readNR12();
      case 0xff13:
        return 0xff; // write-only
      case 0xff14:
        return this.ch1.readNR14();
      case 0xff16:
        return this.ch2.readNR21();
      case 0xff17:
        return this.ch2.readNR22();
      case 0xff18:
        return 0xff; // write-only
      case 0xff19:
        return this.ch2.readNR24();
      case 0xff1a:
        return this.ch3.readNR30();
      case 0xff1b:
        return 0xff; // write-only
      case 0xff1c:
        return this.ch3.readNR32();
      case 0xff1d:
        return 0xff; // write-only
      case 0xff1e:
        return this.ch3.readNR34();
      case 0xff24:
        return (
          ((this.masterVolumeLeft & 0x7) << 4) | (this.masterVolumeRight & 0x7)
        );
      case 0xff25:
        return this.panning;
      case 0xff20:
        return 0xff; // write-only
      case 0xff21:
        return this.ch4.readNR42();
      case 0xff22:
        return this.ch4.readNR43();
      case 0xff23:
        return this.ch4.readNR44();
      case 0xff26:
        return (
          (this.powered ? 0x80 : 0) |
          (this.ch1.enabled ? 0x01 : 0) |
          (this.ch2.enabled ? 0x02 : 0) |
          (this.ch3.enabled ? 0x04 : 0) |
          (this.ch4.enabled ? 0x08 : 0) |
          0x70
        );
      default:
        if (address >= 0xff30 && address <= 0xff3f) {
          return this.ch3.readWaveRam(address - 0xff30);
        }
        return 0xff;
    }
  }

  write(address: number, value: number): void {
    // NR52 and wave RAM are accessible even when powered off
    if (!this.powered) {
      if (address === 0xff26) {
        this.powered = (value & 0x80) !== 0;
        if (this.powered) this.frameSeqStep = 0;
      } else if (address >= 0xff30 && address <= 0xff3f) {
        this.ch3.writeWaveRam(address - 0xff30, value);
      }
      return;
    }

    switch (address) {
      case 0xff10:
        this.ch1.writeNR10(value);
        break;
      case 0xff11:
        this.ch1.writeNR11(value);
        break;
      case 0xff12:
        this.ch1.writeNR12(value);
        break;
      case 0xff13:
        this.ch1.writeNR13(value);
        break;
      case 0xff14:
        this.ch1.writeNR14(value);
        break;
      case 0xff16:
        this.ch2.writeNR21(value);
        break;
      case 0xff17:
        this.ch2.writeNR22(value);
        break;
      case 0xff18:
        this.ch2.writeNR23(value);
        break;
      case 0xff19:
        this.ch2.writeNR24(value);
        break;
      case 0xff1a:
        this.ch3.writeNR30(value);
        break;
      case 0xff1b:
        this.ch3.writeNR31(value);
        break;
      case 0xff1c:
        this.ch3.writeNR32(value);
        break;
      case 0xff1d:
        this.ch3.writeNR33(value);
        break;
      case 0xff1e:
        this.ch3.writeNR34(value);
        break;
      case 0xff24:
        this.masterVolumeLeft = (value >> 4) & 0x7;
        this.masterVolumeRight = value & 0x7;
        break;
      case 0xff25:
        this.panning = value;
        break;
      case 0xff20:
        this.ch4.writeNR41(value);
        break;
      case 0xff21:
        this.ch4.writeNR42(value);
        break;
      case 0xff22:
        this.ch4.writeNR43(value);
        break;
      case 0xff23:
        this.ch4.writeNR44(value);
        break;
      case 0xff26:
        this.powered = (value & 0x80) !== 0;
        if (!this.powered) this.reset();
        break;
      default:
        if (address >= 0xff30 && address <= 0xff3f) {
          this.ch3.writeWaveRam(address - 0xff30, value);
        }
        break;
    }
  }

  private reset(): void {
    this.masterVolumeLeft = 0;
    this.masterVolumeRight = 0;
    this.panning = 0;
    this.ch1 = new SweepPulseChannel();
    this.ch2 = new PulseChannel();
    this.ch3 = new WaveChannel();
    this.ch4 = new NoiseChannel();
    this.frameSeqStep = 0;
  }
}

export { SAMPLE_RATE };
