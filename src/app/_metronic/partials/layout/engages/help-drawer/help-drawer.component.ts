import {Component, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
  styleUrls: ['./help-drawer.component.scss']
})
export class HelpDrawerComponent implements OnInit {
  appThemeName: string = environment.appThemeName;
  appPurchaseUrl: string = environment.appPurchaseUrl;

  flag= false;
  constructor() {
  }

  ngOnInit(): void {
  }
}
