import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { extend, injectBeforeRender } from 'angular-three';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

@Component({
  standalone: true,
  template: `
    <ngt-mesh #mesh>
      <ngt-box-geometry />
      <ngt-mesh-basic-material color="hotpink" />
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  constructor() {
    extend({ Mesh, BoxGeometry, MeshBasicMaterial });
    injectBeforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += delta;
      mesh.rotation.y += delta;
    });
  }
}
