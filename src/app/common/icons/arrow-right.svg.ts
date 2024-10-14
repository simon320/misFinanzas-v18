import { Component } from '@angular/core';

@Component({
  selector: 'icon-arrow-right',
  standalone: true,
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01c38d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  `
})
export class ArrowRightSVG {}
