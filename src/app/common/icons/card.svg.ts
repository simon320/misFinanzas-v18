import { Component } from '@angular/core';

@Component({
  selector: 'icon-card',
  standalone: true,
  template: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
      <line x1="12" x2="13" y1="15" y2="15"/>
      <line x1="15" x2="16" y1="15" y2="15"/>
      <line x1="18" x2="19" y1="15" y2="15"/>
    </svg>
  `
})
export class CardIconComponent {}
