import { Component } from '@angular/core';

@Component({
  selector: 'icon-plus',
  standalone: true,
  template: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  `
})
export class PlusSVG {}
