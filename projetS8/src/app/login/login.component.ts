import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
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
import { UserService } from '../user.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule
  ],
})
export class LoginComponent {
  isRegistering = false;
  isInvalid = false;
  hide = true;
  error_msg = false;

  user_control = new FormControl('', [Validators.required]);
  pass_control = new FormControl('', [Validators.required]);
  acceptTerms = new FormControl(false, [Validators.requiredTrue]);

  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {

  }

  myForm = new FormGroup({
    user: this.user_control,
    pass: this.pass_control,
    acceptTerms: this.acceptTerms
  });

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.userService.setHome('false');
    this.userService.setChatId('');
  }

  onSubmit() {
    console.log(this.isRegistering);
    if(this.isRegistering) {
      this.register();
    } else {
      console.log('getting data');
      this.getData();
    }
  }

  getData() {
      this.apiService.connect(this.user_control.value!, this.pass_control.value!).subscribe({
        next: (data) => {
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

  register() {
    if(this.myForm.valid) {
      this.apiService.register(this.user_control.value!, this.pass_control.value!).subscribe({
        next: (data) => {
          const userId = data.user_id;
          this.authService.setLoggedIn(true);
          this.apiService.setId(userId);
          this.isInvalid = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('There was an error!', error);
          this.isInvalid = true;
        }
      });
    } else {
      this.isInvalid = true;
      this.error_msg = true;
    }
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }
}
