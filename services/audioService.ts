
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private tempo: number = 90;
  private lookahead: number = 25.0;
  private scheduleAheadTime: number = 0.1;
  private nextNoteTime: number = 0.0;
  private timerID: number | null = null;
  private beatCount: number = 0;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // SFX Master
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);

      // BGM Master (Low volume requested: 10%)
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.1; 
      this.bgmGain.connect(this.ctx.destination);
      
      // Apply mute state if set before init
      if (this.isMuted) {
        this.masterGain.gain.value = 0;
        this.bgmGain.gain.value = 0;
      }
    }
  }

  public async startContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.bgmGain) {
      if (this.isMuted) {
        this.masterGain.gain.setValueAtTime(0, this.ctx!.currentTime);
        this.bgmGain.gain.setValueAtTime(0, this.ctx!.currentTime);
      } else {
        this.masterGain.gain.setValueAtTime(0.3, this.ctx!.currentTime);
        this.bgmGain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
      }
    }
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  // --- SYNTHESIS HELPERS ---

  private createOscillator(type: OscillatorType, freq: number, startTime: number, duration: number, gainVal: number = 1, output: GainNode | null = this.masterGain) {
    if (!this.ctx || !output || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(output);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private createNoise(startTime: number, duration: number, output: GainNode | null = this.masterGain) {
     if (!this.ctx || !output || this.isMuted) return;
     const bufferSize = this.ctx.sampleRate * duration;
     const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
     const data = buffer.getChannelData(0);
     for (let i = 0; i < bufferSize; i++) {
       data[i] = Math.random() * 2 - 1;
     }

     const noise = this.ctx.createBufferSource();
     noise.buffer = buffer;
     
     const gain = this.ctx.createGain();
     gain.gain.setValueAtTime(0.5, startTime);
     gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
     
     noise.connect(gain);
     gain.connect(output);
     noise.start(startTime);
  }

  // --- BACKGROUND MUSIC (Simple Lo-Fi Loop) ---

  private playKick(time: number) {
    if(!this.ctx || !this.bgmGain || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    
    osc.start(time);
    osc.stop(time + 0.5);
  }

  private playSnare(time: number) {
    if(!this.ctx || !this.bgmGain || this.isMuted) return;
    this.createNoise(time, 0.1, this.bgmGain);
  }

  private playHiHat(time: number) {
    if(!this.ctx || !this.bgmGain || this.isMuted) return;
    // High pass noise
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);
    noise.start(time);
  }

  private playChord(time: number) {
    if(!this.ctx || !this.bgmGain || this.isMuted) return;
    // Lo-fi chord (Cmaj7 ish)
    const freqs = [261.63, 329.63, 392.00, 493.88];
    freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        // Slight detune for wobble
        osc.detune.value = Math.sin(time * 5 + i) * 10;

        gain.gain.setValueAtTime(0.05, time);
        gain.gain.linearRampToValueAtTime(0.02, time + 0.1);
        gain.gain.linearRampToValueAtTime(0, time + 2); // Long release

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(time);
        osc.stop(time + 2.5);
    });
  }

  private scheduler() {
    while (this.nextNoteTime < this.ctx!.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.beatCount, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = window.setTimeout(this.scheduler.bind(this), this.lookahead);
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
    this.beatCount = (this.beatCount + 1) % 16; // 1 bar loop of 16th notes
  }

  private scheduleNote(beatNumber: number, time: number) {
    // Beat: 1 . 2 . 3 . 4 . 
    // 16ths: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15

    // Kick on 1 and near 3
    if (beatNumber === 0 || beatNumber === 10) {
        this.playKick(time);
    }
    
    // Snare on 5 and 13 (beats 2 and 4)
    if (beatNumber === 4 || beatNumber === 12) {
        this.playSnare(time);
    }

    // Hats every even 16th
    if (beatNumber % 2 === 0) {
        this.playHiHat(time);
    }

    // Chord on 1
    if (beatNumber === 0) {
        this.playChord(time);
    }
  }

  public startBGM() {
    if (this.isBgmPlaying) return;
    this.startContext().then(() => {
        if (!this.ctx) return;
        this.isBgmPlaying = true;
        this.nextNoteTime = this.ctx.currentTime + 0.1;
        this.beatCount = 0;
        this.scheduler();
    });
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.timerID) window.clearTimeout(this.timerID);
  }

  // --- SFX ---

  public playSuccess() {
    this.startContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.createOscillator('square', 440, now, 0.1); 
    this.createOscillator('square', 554.37, now + 0.1, 0.1); 
    this.createOscillator('square', 659.25, now + 0.2, 0.2); 
  }

  public playFailure() {
    this.startContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.createOscillator('sawtooth', 150, now, 0.3);
    this.createOscillator('sawtooth', 140, now, 0.3);
  }

  public playClick() {
    this.startContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.createOscillator('triangle', 800, now, 0.05);
  }

  public playStart() {
    this.startContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.5);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

export const audioService = new AudioService();
