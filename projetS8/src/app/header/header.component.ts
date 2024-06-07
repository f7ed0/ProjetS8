import { Component,ChangeDetectionStrategy  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router,NavigationEnd  } from '@angular/router';
import { NewconvService } from '../newconv.service';
import { ApiServiceService } from '../api-service.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { DrawerService } from '../drawer.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../user.service';

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
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent {

  isLoggedIn: boolean = false;
  isRotated = false;
  isFeedback = this.userService.getFeedback() === 'true' ? true : false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiServiceService,
    private router: Router,
    private newconvService: NewconvService,
    private authService : AuthService,
    private drawerService: DrawerService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ){
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.getisLoggedInValue();
    if(!this.isLoggedIn) {
      this.navigateToLogin();
    }
  }

  logout() {
    this.authService.setLoggedIn(false);
    this.navigateToLogin();
  }

  toggleDrawer() {
    this.drawerService.toggleDrawer();
    this.isRotated = !this.isRotated;
    this.cdr.detectChanges();
  }

  navigateToFeedback() {
    this.userService.setFeedback('true');
    this.router.navigate(['/feedback']);
    this.cdr.detectChanges();
  }

  navigateToHome() {
    this.userService.setFeedback('false');
    this.router.navigate(['/home']);
    this.cdr.detectChanges();
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
