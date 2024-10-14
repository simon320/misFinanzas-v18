import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-checkbox',
  standalone: true,
  template: `
    @if(!check) {
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="6" ry="6"/>
        <circle stroke="#fff" fill="transparent" cx="8" cy="12" r="3.2"/>
      </svg>
    }
    @else {
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="6" ry="6"/>
        <circle stroke="#fff" fill="#fff" cx="16" cy="12" r="3.2"/>
      </svg>
    }`
})
export class CheckboxComponent {
  @Input() check!: boolean;
}
