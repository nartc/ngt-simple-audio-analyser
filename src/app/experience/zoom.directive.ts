import { Directive, inject } from '@angular/core';
import { injectBeforeRender } from 'angular-three';
import { PerspectiveCamera } from 'three';
import { Track } from './track.component';

@Directive({ standalone: true, selector: 'app-track[zoom]' })
export class Zoom {
  track = inject(Track);

  constructor() {
    injectBeforeRender(({ camera }) => {
      const audio = this.track.audio();
      if (!audio) return;

      // Set the cameras field of view according to the frequency average
      (camera as PerspectiveCamera).fov = 25 - audio.avg / 15;
      camera.updateProjectionMatrix();
    });
  }
}
