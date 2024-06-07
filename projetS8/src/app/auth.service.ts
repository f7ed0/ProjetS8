import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {
    // Initialisation de l'état de connexion à partir du stockage local
    const loggedInStatus = localStorage.getItem('loggedIn');
    this.loggedIn.next(loggedInStatus === 'true');
  }

  setLoggedIn(value: boolean) {
    if (!value) {
      this.userService.setId("");
    }
    this.loggedIn.next(value); // Mise à jour de la valeur de loggedIn
    localStorage.setItem('loggedIn', value ? "true" : "false");
  }

  getisLoggedInValue(): boolean {
    return this.loggedIn.getValue();
  }
}
