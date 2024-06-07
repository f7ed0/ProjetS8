import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../api-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule,],
})
export class LoginComponent {
  isRegistering = false;
  isInvalid = false;
  hide = true;

  user_control = new FormControl('', [Validators.required]);
  pass_control = new FormControl('', [Validators.required]);

  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  ngOnInit(): void {
    console.log(this.authService.getisLoggedInValue);
  }

  getData() {
    if(this.user_control.value && this.pass_control.value) {
      this.apiService.connect(this.user_control.value, this.pass_control.value).subscribe({
        next :(data) => {
          const userId = data.user_id;
          this.apiService.setId(userId);
          this.isInvalid = false;
          this.authService.setLoggedIn(true);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('There was an error!', error);
          this.isInvalid = true;
        }
      });
    }
  }

  register() {
    if(this.user_control.value && this.pass_control.value) {
      this.apiService.register(this.user_control.value, this.pass_control.value).subscribe({
        next : (data) => {
          this.authService.setLoggedIn(true);
          this.isInvalid = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    }
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }
}
