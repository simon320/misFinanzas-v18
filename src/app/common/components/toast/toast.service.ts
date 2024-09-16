
import { Injectable, signal } from "@angular/core";

export type MessageType = 'ERROR' | 'SUCCESS';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
  public title = signal<string>('');
  public description = signal<string>('');
  public classStyle = signal<string>('');
  public toastIsVisible = signal<boolean>(false);
  public timeVisible = signal<boolean>(false);

  public show(type: MessageType, title: string, description: string): void {
    this.title.set(title);
    this.classStyle.set(type);
    this.description.set(description);
    this.timeVisible.set(true);
    this.toastIsVisible.set(true);

    setTimeout(() => {
      this.timeVisible.set(false)
    }, 2000)
  }

  public hide(): void {
    this.toastIsVisible.set(false);
  }

}
