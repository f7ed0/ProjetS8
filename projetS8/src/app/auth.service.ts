import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  logout() {
    this.loggedIn.next(false);
  }

  get isLoggedInValue(): boolean {
    return this.loggedIn.getValue();
  }


}
