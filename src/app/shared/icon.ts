import { Component, input } from '@angular/core';

type IconName = 'maximize' | 'chevron-left' | 'chevron-right' | 'close';

/** Shared icon geometry for the whole site. Labels belong to the parent control. */
@Component({
  selector: 'app-icon',
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">
      @switch (name()) {
        @case ('maximize') { <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /> }
        @case ('chevron-left') { <path d="m15 6-6 6 6 6" /> }
        @case ('chevron-right') { <path d="m9 6 6 6-6 6" /> }
        @case ('close') { <path d="m6 6 12 12M6 18 18 6" /> }

      }
    </svg>
  `,
  styles: `:host { display: inline-flex; width: 1.2em; height: 1.2em; flex: 0 0 auto; vertical-align: middle; } svg { display: block; width: 100%; height: 100%; }`,
})
export class Icon {
  readonly name = input.required<IconName>();
}
