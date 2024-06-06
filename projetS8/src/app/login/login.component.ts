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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule,],
  providers: [ApiServiceService] // Add HttpClient here
})
export class LoginComponent {
  isRegistering = false;
  hide = true;

  user_control = new FormControl('', [Validators.required]);
  pass_control = new FormControl('', [Validators.required]);

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

  //pour se connecter
  getData() {
    console.log(this.user_control.value);
    if(this.user_control.value && this.pass_control.value) {
      console.log(this.user_control.value);
      this.apiService.connect(this.user_control.value, this.pass_control.value).subscribe((data) => {
      this.dialogRef.close();
      this.apiService.login();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  register() {
    if(this.user_control.value && this.pass_control.value) {
      this.apiService.register(this.user_control.value, this.pass_control.value).subscribe((data) => {
      this.dialogRef.close();
      this.apiService.login();
      });
    }
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }
}
