import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessagesComponent } from '../messages/messages.component';
import { ConvsComponent } from '../convs/convs.component';
import { NewconvComponent } from '../newconv/newconv.component';
import { NewconvService } from '../newconv.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../user.service';
import { ApiServiceService } from '../api-service.service';
import { DrawerService } from '../drawer.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme.service';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MessagesComponent,
    ConvsComponent,
    NewconvComponent,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class MainComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isChevronLeft: boolean = true;
  showNewConv = this.newconvService.getShowNewConv();
  chatUser : any;
  isLightTheme = this.themeService.isLightTheme();
  isRotated = false;
  private drawerSubscription: Subscription | undefined;
  screenWidth: number = 0;

  constructor(
    private newconvService: NewconvService,
    private cdr: ChangeDetectorRef,
    private u: UserService,
    private apiService: ApiServiceService,
    private drawerService: DrawerService,
    private themeService: ThemeService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.drawer.open();
    this.newconvService.showNewConv$.subscribe(state => {
      this.showNewConv = state;
      this.cdr.detectChanges();
    });
    this.u.setHome('false');
    this.cdr.detectChanges();
    this.drawerSubscription = this.drawerService.toggleDrawer$.subscribe(() => {
      this.toggleDrawer();
    });
    this.checkScreenWidth();
    if(this.isMobile()) {
      this.drawer.close();
      this.toggleIcon();
    }
  }

  ngOnDestroy() {
    if (this.drawerSubscription) {
      this.drawerSubscription.unsubscribe();
    }
  }

  toggleDrawer() {
    this.drawer.toggle();
    this.toggleIcon();
  }

  toggleIcon() {
    this.isChevronLeft = !this.isChevronLeft;
  }

  checkScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.screenWidth < 768; 
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isLightTheme = !this.isLightTheme;
    this.isRotated = !this.isRotated;
    this.cdr.detectChanges();
  }

  toggleRGPD(){
    this.dialog.open(RGPDComponent, {
      width: '90%',
      maxWidth: '900px'
    });
  }


}

@Component({
  selector: 'rgpd-component',
  templateUrl: 'rgpd.component.html',
  styleUrls: ['rgpd.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatButtonModule, MatButtonModule, MatDialogActions, MatDialogClose],
})
export class RGPDComponent {
  constructor(
    public dialogRef: MatDialogRef<RGPDComponent>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private userService: UserService
  ) {}

  goToResetPage(){
    this.dialogRef.close();
    this.userService.setHome('true');
    this.router.navigate(['/reset']);
    this.cdr.detectChanges();
  }

}
