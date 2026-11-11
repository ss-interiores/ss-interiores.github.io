import { Component, input } from '@angular/core';

@Component({
  selector: 'app-studio-logo',
  host: { 'aria-hidden': 'true' },
  template: `<img [src]="light() ? 'images/simoes-scatrut-logo-light.svg?v=alpha-2' : 'images/simoes-scatrut-logo.svg?v=alpha-2'" width="487" height="125" alt="" />`,
  styles: `:host { display: block; width: 100%; height: 100%; } img { display: block; width: 100%; height: 100%; object-fit: contain; }`,
})
export class StudioLogo {
  readonly light = input(false);
}
