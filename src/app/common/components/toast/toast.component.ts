import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';

import { ToastService } from './toast.service';
import { CrossSVG } from "../../icons/cross.svg";
import { ConfirmSVG } from '../../icons/confirm.svg';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, CrossSVG, ConfirmSVG],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  private toastService = inject(ToastService);

  private inside = false;
  public isVisible = this.toastService.isVisible;
  public classType = this.toastService.classStyle;
  public description = this.toastService.description;
  public timeVisible = this.toastService.timeVisible;
  public confirmationSignal = this.toastService.confirmationSignal;
  public message = signal<string | null>(null);
  private resolveFn: (result: boolean) => void = () => {};


  constructor() {
    effect(() => {
      const dialogData = this.toastService.confirmSignal;

      if (dialogData) {
        this.resolveFn = dialogData.resolve;
        this.timeVisible.set(true);
        this.isVisible.set(true);
      } else {
        this.isVisible.set(false);
      }
    }, {allowSignalWrites: true});
  }


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

  public confirm(): void {
    this.resolveFn(true);
    this.isVisible.set(false);
    this.toastService.hide();
  }

  public close(): void {
    this.resolveFn(false);
    this.toastService.hide();
  }

  public setClass(type: string): string {
    switch (type) {
      case 'SUCCESS': return 'toast__container success';
      case 'CONFIRM': return 'toast__container confirm';
      case 'ERROR': return 'toast__container error';
      default: return 'toast__container';
    }
  }

}
