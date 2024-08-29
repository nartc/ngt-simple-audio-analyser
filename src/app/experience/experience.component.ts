import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { Mesh, PlaneGeometry, ShadowMaterial, SpotLight, Vector2 } from 'three';
import { tracks, zoomIndex } from '../tracks';
import { Track } from './track.component';
import { Zoom } from './zoom.directive';

@Component({
  standalone: true,
  template: `
    <ngt-spot-light [position]="[-4, 4, -4]" [angle]="0.06" [penumbra]="1" [castShadow]="true">
      <ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize" />
    </ngt-spot-light>

    @for (track of tracks; track track.sound) {
      <app-track [sound]="track.sound" [position]="[0, 0, track.positionZ]" [zoom]="zoomIndex() === $index" />
    }

    <ngt-mesh [receiveShadow]="true" [rotation]="[-Math.PI / 2, 0, 0]" [position]="[0, -0.025, 0]">
      <ngt-plane-geometry />
      <ngt-shadow-material [transparent]="true" [opacity]="0.15" />
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, Track, Zoom],
})
export class Experience {
  protected readonly Math = Math;

  protected readonly tracks = tracks;
  protected readonly zoomIndex = zoomIndex;

  constructor() {
    extend({ SpotLight, Vector2, Mesh, PlaneGeometry, ShadowMaterial });
  }
}
