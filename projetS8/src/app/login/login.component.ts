import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ApiServiceService } from '../api-service.service';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  ],
  providers: [ApiServiceService]
})
export class LoginComponent {
  isRegistering = false;
  hide = true;

  user_control = "" 
  pass_control = ""

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private apiService: ApiServiceService
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  ngOnInit(): void {}

  getData() {
    console.log("Attempting to log in");
    if (this.user_control && this.pass_control) {
      this.apiService.connect(this.user_control, this.pass_control).subscribe(
        (data) => {
          this.apiService.login();
          this.dialogRef.close();
        },
        (error) => {
          console.error("Login failed", error);
        }
      );
    } else {
      console.error("Invalid form data");
    }
  }

  register() {
    console.log("Attempting to register");
    if (this.user_control && this.pass_control) {
      this.apiService.register(this.user_control, this.pass_control).subscribe(
        (data) => {
          this.apiService.login();
          this.dialogRef.close();
        },
        (error) => {
          console.error("Registration failed", error);
        }
      );
    } else {
      console.error("Invalid form data");
    }
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
