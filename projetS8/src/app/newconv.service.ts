import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewconvService {
  private showNewConvSubject: BehaviorSubject<boolean>;
  showNewConv$;

  constructor() {
    this.showNewConvSubject = new BehaviorSubject<boolean>(true);
    this.showNewConv$ = this.showNewConvSubject.asObservable(); // Initialisez cette propriété ici
  }

  setNewConv() {
    this.showNewConvSubject.next(true); // Update BehaviorSubject
  }

  setMessages() {
    this.showNewConvSubject.next(false); // Update BehaviorSubject
  }

  getShowNewConv(): boolean {
    return this.showNewConvSubject.getValue();
  }
}
