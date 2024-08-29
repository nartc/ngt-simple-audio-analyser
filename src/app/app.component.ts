import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { Experience } from './experience/experience.component';
import { Overlay } from './experience/overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="h-screen">
      <ngt-canvas [sceneGraph]="sceneGraph" [shadows]="true" [camera]="{ position: [-1, 1.5, 2], fov: 25 }" />
    </div>
    <app-overlay />
  `,
  imports: [NgtCanvas, Overlay],
})
export class AppComponent {
  sceneGraph = Experience;
}
