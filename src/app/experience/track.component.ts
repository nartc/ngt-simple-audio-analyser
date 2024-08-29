import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { extend, injectBeforeRender, NgtArgs } from 'angular-three';
import { InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';
import { AudioStore } from '../audio.store';

@Component({
  selector: 'app-track',
  standalone: true,
  template: `
    <ngt-instanced-mesh #instanced *args="[undefined, undefined, length()]" [castShadow]="true" [position]="position()">
      <ngt-plane-geometry *args="[0.01, 0.05]" />
      <ngt-mesh-basic-material [toneMapped]="false" />
    </ngt-instanced-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs],
})
export class Track {
  sound = input.required<'drums' | 'synth' | 'snare'>();
  position = input([0, 0, 0]);

  private instancedRef = viewChild<ElementRef<InstancedMesh<PlaneGeometry, MeshBasicMaterial>>>('instanced');

  private audioStore = inject(AudioStore);

  audio = computed(() => this.audioStore[this.sound()]());
  protected length = computed(() => {
    return this.audio()?.data.length;
  });

  constructor() {
    extend({ InstancedMesh, PlaneGeometry, MeshBasicMaterial });

    effect((onCleanup) => {
      const audio = this.audio();
      if (!audio) return;
      const { gainNode, audioContext } = audio;
      gainNode.connect(audioContext.destination);
      onCleanup(() => gainNode.disconnect());
    });

    const obj = new Object3D();
    injectBeforeRender(() => {
      const instanced = this.instancedRef()?.nativeElement;
      if (!instanced) return;

      const audio = this.audio();
      if (!audio) return;

      const { data } = audio;
      const avg = audio.update();

      // Distribute the instanced planes according to the frequency data
      for (let i = 0; i < data.length; i++) {
        obj.position.set(i * 0.01 * 1.8 - (data.length * 0.01 * 1.8) / 2, data[i] / 2500, 0);
        obj.updateMatrix();
        instanced.setMatrixAt(i, obj.matrix);
      }
      // Set the hue according to the frequency average
      instanced.material.color.setHSL(avg / 500, 0.75, 0.75);
      instanced.instanceMatrix.needsUpdate = true;
    });
  }
}
