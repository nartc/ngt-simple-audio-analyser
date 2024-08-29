import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AudioStore } from '../audio.store';

@Component({
  selector: 'app-overlay',
  standalone: true,
  template: `
    <div
      [class.cursor-pointer]="audioStore.loaded()"
      class="absolute left-0 top-0 block flex h-screen w-screen flex-col items-center justify-center gap-2 font-mono transition"
      [class]="audioStore.clicked() ? ['pointer-events-none', 'opacity-0'] : []"
    >
      @if (audioStore.loaded()) {
        <span>This sandbox needs</span>
        <span>user interaction for audio</span>
        <button
          class="cursor-pointer self-center rounded border border-b-4 border-transparent border-b-gray-400 bg-white px-10 py-2"
          (click)="onClick()"
        >
          ▶︎
        </button>
      } @else {
        <span>loading</span>
      }
    </div>
    <code class="absolute bottom-0 right-0 text-white opacity-0" [class.opacity-100]="audioStore.clicked()">
      Triplet After Triplet · SEGA · Hidenori Shoji
    </code>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host > div {
      background: linear-gradient(15deg, rgb(82, 81, 88) 0%, rgb(255, 247, 248) 100%);
    }
  `,
})
export class Overlay {
  protected audioStore = inject(AudioStore);

  onClick() {
    if (this.audioStore.loaded()) {
      this.audioStore.start();
    }
  }
}
