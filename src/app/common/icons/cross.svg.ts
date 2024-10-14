import { Component } from '@angular/core';

@Component({
  selector: 'icon-cross',
  standalone: true,
  template: `
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  `
})
export class CrossSVG {}
