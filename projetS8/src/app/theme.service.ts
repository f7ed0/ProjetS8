import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isLight = true;

  constructor() { }

  toggleTheme() { 
    this.isLight = !this.isLight;
    document.documentElement.setAttribute('data-theme', this.isLight ? 'light' : 'dark');
  }

  isLightTheme() {
    return this.isLight;
  }


}
