import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDark = false;

  constructor() { }

  toggleTheme() { 
    this.isDark = !this.isDark;
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }

  isDarkTheme() {
    return this.isDark;
  }


}
