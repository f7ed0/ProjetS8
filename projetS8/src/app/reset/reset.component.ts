import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';

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
    private newconvService: NewconvService
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

  suppData(){

  }

}
