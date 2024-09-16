import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    @if(toastIsVisible()) {
      <div [ngClass]="classType() === 'ERROR' ? 'toast__container error' : 'toast__container success'">

        @if(classType() === 'ERROR') {
          <!-- ERROR -->
          <svg class="svg__error" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        }
        @else {
          <!-- SUCCESS -->
          <svg class="svg__success" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        }
        <div class="text">
          <h2>{{ title() }}</h2>
          <p>{{ description() }}</p>
        </div>
        <button (click)="close()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    }`,
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  private toastService = inject(ToastService);

  public title = this.toastService.title;
  public description = this.toastService.description;
  public toastIsVisible = this.toastService.toastIsVisible;
  public classType = this.toastService.classStyle;
  private inside = false;

  @HostListener("click")
  clicked() {
    this.inside = true;
  }

  @HostListener("document:click")
  clickedOut() {
    if(!this.toastService.timeVisible() && !this.inside)
      this.close();

    this.inside = false;
  }

  public close(): void {
    this.toastService.hide();
  }
}
