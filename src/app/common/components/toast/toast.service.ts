
import { Injectable, signal } from "@angular/core";

export type MessageType = 'ERROR' | 'SUCCESS' | 'CONFIRM';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
  public classStyle = signal<string>('');
  public description = signal<string>('');
  public isVisible = signal<boolean>(false);
  public timeVisible = signal<boolean>(false);
  public confirmationSignal = signal<{ message: string | null, resolve: (result: boolean) => void } | null>(null);

  public show(type: MessageType, description: string): void {
    this.classStyle.set(type);
    this.description.set(description);
    this.timeVisible.set(true);
    this.isVisible.set(true);

    setTimeout(() => {
      this.hide()
    }, 2000)
  }

  public hide(): void {
    this.confirmationSignal.set(null);
    this.isVisible.set(false);
  }

  public get confirmSignal() {
    return this.confirmationSignal();
  }

  public confirm(message: string): Promise<boolean> {
    this.description.set(message);
    this.classStyle.set('CONFIRM');

    return new Promise<boolean>(resolve => {
      this.confirmationSignal.set({ message, resolve });
    });
  }

}
