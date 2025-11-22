class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy init in method to handle autoplay policies
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Prevent ear blasting
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public async startContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  private createOscillator(type: OscillatorType, freq: number, startTime: number, duration: number, gainVal: number = 1) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public playSuccess() {
    this.startContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Major 3rd arpeggio
    this.createOscillator('square', 440, now, 0.1); // A4
    this.createOscillator('square', 554.37, now + 0.1, 0.1); // C#5
    this.createOscillator('square', 659.25, now + 0.2, 0.2); // E5
  }

  public playFailure() {
    this.startContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Discordant buzz
    this.createOscillator('sawtooth', 150, now, 0.3);
    this.createOscillator('sawtooth', 140, now, 0.3);
  }

  public playClick() {
    this.startContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.createOscillator('triangle', 800, now, 0.05);
  }

  public playStart() {
    this.startContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Power up sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.5);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

export const audioService = new AudioService();