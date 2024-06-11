import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {
  constructor(
    private userService: UserService,
    private router : Router,
    private newconvService: NewconvService,
    private apiService: ApiServiceService
  ) {}

  acceptTerms = new FormControl(false, [Validators.requiredTrue]);
  resetForm = new FormGroup({
    acceptTerms: this.acceptTerms
  });

  navigateToHome(){
    this.newconvService.setNewConv();
    this.userService.setHome('false');
    this.userService.setChatId('');
    this.router.navigate(['/home']);
  }

  navigateToLogin(){
    this.userService.setHome('false');
    this.userService.setChatId('');
    this.router.navigate(['']);
  }

  suppData(){
    this.apiService.resetAllHistoric_by_chat_id_user(this.userService.getId()).subscribe(
      (data) => {
        console.log(data);
      }
    );
    console.log("suppData");
    this.apiService.deleteUser(this.userService.getId()).subscribe(
      (data) => {
        console.log(this.userService.getId());
        console.log("ZOOOOOO");
        console.log(data);
      }
    );
    this.navigateToLogin();
  }

}
