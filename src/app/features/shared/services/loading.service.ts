import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSignal = signal<boolean>(false);
  public loading = this.loadingSignal.asReadonly();
  
  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSignal.set(false);
    }
  }
}
