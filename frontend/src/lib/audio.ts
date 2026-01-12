// Audio synthesis utilities using Web Audio API
// This is a simplified version that works without external libraries

class AudioEngine {
  private audioContext: AudioContext | null = null;
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  // Convert note name to frequency
  private noteToFreq(note: string): number {
    const noteMap: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    const match = note.match(/^([A-G][b#]?)(\d)$/);
    if (!match) return 440;
    
    const [, noteName, octave] = match;
    const noteNum = noteMap[noteName];
    const octaveNum = parseInt(octave);
    
    // A4 = 440Hz is note number 69
    const midiNote = (octaveNum + 1) * 12 + noteNum;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // Play a single note
  playNote(note: string, duration: number = 0.5, delay: number = 0): void {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = this.noteToFreq(note);
    oscillator.type = 'sine';
    
    const now = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  // Play a chord (multiple notes simultaneously)
  playChord(notes: string[], duration: number = 1): void {
    notes.forEach(note => this.playNote(note, duration, 0));
  }

  // Play a melodic interval (two notes in sequence)
  playInterval(note1: string, note2: string): void {
    this.playNote(note1, 0.5, 0);
    this.playNote(note2, 0.5, 0.5);
  }

  // Play rhythm pattern
  playRhythm(pattern: 'waltz' | 'common', measures: number = 2): void {
    const ctx = this.getContext();
    const bpm = 120;
    const beatDuration = 60 / bpm;
    
    const playDrum = (time: number, type: 'kick' | 'snare' | 'hat') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'kick') {
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
      } else if (type === 'snare') {
        const noise = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;
        noise.connect(gain);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        noise.start(time);
        noise.stop(time + 0.1);
      } else {
        osc.frequency.value = 10000;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        osc.start(time);
        osc.stop(time + 0.05);
      }
    };

    const now = ctx.currentTime;
    const beatsPerMeasure = pattern === 'waltz' ? 3 : 4;
    const totalBeats = beatsPerMeasure * measures;
    
    for (let i = 0; i < totalBeats; i++) {
      const time = now + i * beatDuration;
      const beat = i % beatsPerMeasure;
      
      // Kick on beat 1, and beat 3 in 4/4
      if (beat === 0 || (pattern === 'common' && beat === 2)) {
        playDrum(time, 'kick');
      } else {
        playDrum(time, 'snare');
      }
      
      // Hi-hat on every beat
      playDrum(time, 'hat');
      playDrum(time + beatDuration / 2, 'hat');
    }
  }
}

export const audio = new AudioEngine();
