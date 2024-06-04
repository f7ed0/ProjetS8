import { Component, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private dialog: MatDialog
  ){}


  openDialog() {
    let d = this.dialog.open(LoginComponent, {data : undefined});
    d.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    });
  }

}
