import {Component, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule, MatDrawer} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatButtonModule, MatSidenavModule, MatIconModule, MatTooltipModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements AfterViewInit{
  @ViewChild('drawer') drawer!: MatDrawer;
  isChevronLeft: boolean = false;

  ngAfterViewInit() {
    this.drawer.open();
  }

  toggleDrawer() {
    this.drawer.toggle();
    this.isChevronLeft = !this.drawer.opened;
  }

  toggleIcon() {
    this.isChevronLeft = !this.isChevronLeft;
  }
}
