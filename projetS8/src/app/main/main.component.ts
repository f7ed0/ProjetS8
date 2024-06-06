import {Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule, MatDrawer} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MessagesComponent} from '../messages/messages.component';
import { ConvsComponent } from '../convs/convs.component';
import { NewconvComponent } from '../newconv/newconv.component';
import { NewconvService } from '../newconv.service';
import { CommonModule } from '@angular/common';


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
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isChevronLeft: boolean = true;
  showNewConv = true;

  constructor(
    private newconvService: NewconvService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.drawer.open();
    this.newconvService.showNewConv$.subscribe(state => {
      this.showNewConv = state;
      this.cdr.detectChanges();
    });
  }

  toggleDrawer() {
    this.drawer.toggle();
    this.toggleIcon();
  }

  toggleIcon() {
    this.isChevronLeft = !this.isChevronLeft;
  }

}


