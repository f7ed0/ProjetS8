import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ApiServiceService } from '../api-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule,],
  providers: [ApiServiceService] 
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
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  ngOnInit(): void {}

  getData() {
    console.log(this.user_control.value);
    if(this.user_control.value && this.pass_control.value) {
      this.apiService.connect(this.user_control.value, this.pass_control.value).subscribe({
        next :(data) => {
          console.log('Connexion autorisée !');
          console.log(data)
          const userId = data.user_id;
          this.apiService.setId(userId);
          this.isInvalid = false;
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
          this.apiService.login();
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
