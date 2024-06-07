import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewconvService {
  private showNewConvSubject = new BehaviorSubject<boolean>(true);
  showNewConv$ = this.showNewConvSubject.asObservable();

  setNewConv() {
    this.showNewConvSubject.next(true);
    console.log(this.showNewConvSubject.value);
  }

  setMessages() {
    this.showNewConvSubject.next(false);
    console.log(this.showNewConvSubject.value);
  }

  getShowNewConv() {
    return this.showNewConvSubject.value;
  }
}
