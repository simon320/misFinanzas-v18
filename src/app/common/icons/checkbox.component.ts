import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-checkbox',
  standalone: true,
  template: `
    @if(!check) {
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="6" ry="6"/>
        <circle stroke="#01010188" fill="#01010188" cx="8" cy="12" r="3.2"/>
      </svg>
    }
    @else {
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="6" ry="6"/>
        <circle stroke="#000" fill="#0000ffbb" cx="16" cy="12" r="3.2"/>
      </svg>
    }`
})
export class CheckboxComponent {
  @Input() check!: boolean;
}
