import { computed, Injectable, signal } from '@angular/core';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export type Audio = Awaited<ReturnType<AudioStore['createAudio']>>;

@Injectable({ providedIn: 'root' })
export class AudioStore {
  clicked = signal(false);

  drums = signal<Audio | null>(null);
  synth = signal<Audio | null>(null);
  snare = signal<Audio | null>(null);

  loaded = computed(() => {
    const [drums, synth, snare] = [this.drums(), this.synth(), this.snare()];
    return !!drums && !!synth && !!snare;
  });

  constructor() {
    this.createAudio('./drum-final.mp3').then(this.drums.set.bind(this.drums));
    this.createAudio('./synth-final.mp3').then(this.synth.set.bind(this.synth));
    this.createAudio('./snare-final.mp3').then(this.snare.set.bind(this.snare));
  }

  start() {
    const [drums, synth, snare] = [this.drums(), this.synth(), this.snare()];
    if (!drums || !synth || !snare) return;

    drums.source.start(0);
    synth.source.start(0);
    snare.source.start(0);
    this.clicked.set(true);
  }

  private async createAudio(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const source = audioContext.createBufferSource();
    source.buffer = await new Promise((res) => audioContext.decodeAudioData(buffer, res));
    source.loop = true;

    const gainNode = audioContext.createGain();

    source.connect(analyser);
    analyser.connect(gainNode);

    let avg = 0;

    return {
      audioContext,
      source,
      data,
      gainNode,
      avg,
      update() {
        analyser.getByteFrequencyData(data);

        avg = data.reduce((prev, cur) => prev + cur / data.length, 0);

        if (this) {
          this.avg = avg;
        }

        // Calculate a frequency average
        return avg;
      },
    };
  }
}
