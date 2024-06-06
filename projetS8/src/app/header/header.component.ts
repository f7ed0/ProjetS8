import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';
import { ApiServiceService } from '../api-service.service';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule

  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ApiServiceService]
})
export class HeaderComponent {

  isLoggedIn: boolean = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiServiceService,
    private router: Router,
    private newconvService: NewconvService
  ){}

  ngOnInit() {
    this.apiService.isLoggedIn.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  openDialog() {
    let d = this.dialog.open(LoginComponent, {data : undefined});
    d.afterClosed().subscribe(result => {
      console.log(this.isLoggedIn);
      console.log(`Dialog result: ${result}`);
    });
  }

  logout() {
    this.apiService.logout();
    this.navigateToLogin();
  }

  navigateToFeedback() {
      this.router.navigate(['/feedback']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToLogin() {
    this.router.navigate(['/']);
  }

  setNewConv() {
    this.newconvService.setNewConv();
  }

  setMessages() {
    this.newconvService.setMessages();
  }
}
