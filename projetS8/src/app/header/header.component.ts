import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isLoggedIn: boolean = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private newconvService: NewconvService
  ){}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  openDialog() {
    let d = this.dialog.open(LoginComponent, {data : undefined});
    d.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateToAnotherComponent() {
    if (this.isLoggedIn) {
      this.router.navigate(['/feedback']);
    } else {
      this.openDialog(); 
    }
  }

  setNewConv() {
    this.newconvService.setNewConv();
  }

  setMessages() {
    this.newconvService.setMessages();
  }
}
