// Web Audio API Synthesizer and Soundscapes for 30th Birthday Tribute
// Zero-dependency, zero-download, and highly optimized for mobile devices.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private isMuted: boolean = true;
  private bgMusic: HTMLAudioElement | null = null;

  // Pentatonic scale frequencies for warm transitions
  // A minor pentatonic: A3, C4, D4, E4, G4, A4, C5, D5, E5, G5, A5, C6
  private scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  constructor() {
    if (typeof window !== "undefined") {
      this.bgMusic = new Audio("https://www.dfy.co.kr/media/bg.e169f5c9.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0; // start silent
    }
  }

  public init() {
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime); // start silent

      // Low pass filter for warm, cozy dream-like analog synth tones
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);

      // Route: Filter -> Master Gain -> Destination
      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked: ", e);
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    this.init();

    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const targetVolume = mute ? 0.0 : 0.45;
    this.masterGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.15);

    if (this.bgMusic) {
      if (mute) {
        this.bgMusic.volume = 0;
        this.bgMusic.pause();
      } else {
        // Gentle background music volume (0.12) to ensure transition chimes are clearly heard
        this.bgMusic.volume = 0.12;
        this.bgMusic.play().catch(err => {
          console.warn("Autoplay or user interaction blocked bg music: ", err);
        });
      }
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // Triggered when she scrolls to a new section
  // It plays a lovely warm chime corresponding to the item ID
  public playTransitionChime(index: number) {
    this.init();
    if (this.isMuted || !this.ctx || !this.filter) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    // Determine note based on index in scale
    const scaleNote = this.scale[index % this.scale.length];

    // Sub-bass undertone (for depth)
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = "sine";
    bassOsc.frequency.setValueAtTime(scaleNote / 4, t);
    bassGain.gain.setValueAtTime(0, t);
    bassGain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    bassOsc.connect(bassGain);
    bassGain.connect(this.filter);
    bassOsc.start(t);
    bassOsc.stop(t + 1.5);

    // Warm Rhodes-like electric piano chime
    const mainOsc = this.ctx.createOscillator();
    const mainGain = this.ctx.createGain();
    mainOsc.type = "triangle";
    mainOsc.frequency.setValueAtTime(scaleNote, t);
    mainGain.gain.setValueAtTime(0, t);
    mainGain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    mainOsc.connect(mainGain);
    mainGain.connect(this.filter);
    mainOsc.start(t);
    mainOsc.stop(t + 1.0);

    // High sparkling overtone
    const sparkOsc = this.ctx.createOscillator();
    const sparkGain = this.ctx.createGain();
    sparkOsc.type = "sine";
    sparkOsc.frequency.setValueAtTime(scaleNote * 2, t);
    sparkOsc.detune.setValueAtTime(10, t);
    sparkGain.gain.setValueAtTime(0, t);
    sparkGain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    sparkOsc.connect(sparkGain);
    sparkGain.connect(this.filter);
    sparkOsc.start(t);
    sparkOsc.stop(t + 0.5);
  }

  // Play a triumphant birthday chord on reaching the end or blowing candles
  public playTriumphantChord() {
    this.init();
    if (this.isMuted || !this.ctx || !this.filter) return;

    const t = this.ctx.currentTime;
    
    // C Major Triad high notes + bass
    const chordNotes = [130.81, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

    chordNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.filter) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + (idx * 0.04)); // Arpeggiated chord entrance!

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.25 : 0.12, t + (idx * 0.04) + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);

      osc.connect(gain);
      gain.connect(this.filter);
      
      osc.start(t);
      osc.stop(t + 3.5);
    });
  }

  public dispose() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

// Export a singleton audio engine
export const audio = new AudioEngine();
