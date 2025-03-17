import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeModeComponent } from '../../../kt/layout';

export type ThemeModeType = 'dark' | 'light' | 'system';
const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark';
const themeModeSwitchHelper = (_mode: ThemeModeType) => {
  // change background image url
  const mode = _mode !== 'system' ? _mode : systemMode;
  const imageUrl =
    './assets/media/patterns/header-bg' +
    (mode === 'light' ? '.jpg' : '-dark.png');
  document.body.style.backgroundImage = `url("${imageUrl}")`;
};

const themeModeLSKey = 'kt_theme_mode_value';
const themeMenuModeLSKey = 'kt_theme_mode_menu';

const getThemeModeFromLocalStorage = (lsKey: string): ThemeModeType => {
  if (!localStorage) {
    return 'light';
  }

  const data = localStorage.getItem(lsKey);
  const primengTheme = localStorage.getItem('primeng-theme');
  if (!data) {
    return 'light';
  }

  if (data === 'light') {
    return 'light';
  }

  if (data === 'dark' && primengTheme === 'my-app-dark') {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
    } else {
      console.error("HTML element not found.");
    }
    return 'dark';
  }

  return 'system';
};

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {

  angularMaterialTheme : any;

  public mode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      getThemeModeFromLocalStorage(themeModeLSKey)
    );
  public menuMode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      getThemeModeFromLocalStorage(themeMenuModeLSKey)
    );

  constructor() {}

  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? systemMode : _mode;
    this.mode.next(updatedMode);
    // themeModeSwitchHelper(updatedMode)
    if (localStorage) {
      localStorage.setItem(themeModeLSKey, updatedMode);
    }

    document.documentElement.setAttribute('data-theme', updatedMode);
    ThemeModeComponent.init();
  }

  public updateMenuMode(_menuMode: ThemeModeType) {
    this.menuMode.next(_menuMode);
    if (localStorage) {
      localStorage.setItem(themeMenuModeLSKey, _menuMode);
    }
  }

  public init() {
    this.updateMode(this.mode.value);
    this.updateMenuMode(this.menuMode.value);
    
    // Temayı güncelledikten sonra Primeng temasını değiştirmek için:
    this.updatePrimeNgTheme();
  }
  
  private updatePrimeNgTheme() {
    const theme = this.mode.value === 'dark' ? 'my-app-dark' : '';
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark', theme === 'my-app-dark');
    }
  }
  

  public switchMode(_mode: ThemeModeType) {
    if (localStorage) {
      const updatedMode = _mode === 'system' ? systemMode : _mode;
      localStorage.setItem(themeModeLSKey, updatedMode);
      localStorage.setItem(themeMenuModeLSKey, _mode);
      localStorage.setItem('primeng-theme', _mode === 'dark' ? 'my-app-dark' : '');
    }
    
    document.location.reload()
  }
  

  public getSelectedThemeColor(): string {
    const selectedMode = this.mode.value;
    switch (selectedMode) {
      case 'dark':
        return 'pink-blue-grey';
      case 'light':
        return 'indigo-pink';
      case 'system':
        return ThemeModeComponent.getSystemMode() === 'dark' ? 'pink-blue-grey' : 'indigo-pink';
      default:
        return 'indigo-pink';
    }
  }
}
