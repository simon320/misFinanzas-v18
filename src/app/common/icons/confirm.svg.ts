import { Component } from '@angular/core';

@Component({
  selector: 'icon-confirm',
  standalone: true,
  template: `
    <svg class="svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  `
})
export class ConfirmSVG {}
