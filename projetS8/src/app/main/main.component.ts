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
import { DrawerService } from '../drawer.service';
import { Subscription } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isChevronLeft: boolean = true;
  showNewConv = true;
  private drawerSubscription: Subscription | undefined;
  screenWidth: number = 0;

  constructor(
    private newconvService: NewconvService,
    private cdr: ChangeDetectorRef,
    private drawerService: DrawerService
  ) { }

  ngAfterViewInit() {
    this.drawer.open();
    this.newconvService.showNewConv$.subscribe(state => {
      this.showNewConv = state;
      this.cdr.detectChanges();
    });

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
}
