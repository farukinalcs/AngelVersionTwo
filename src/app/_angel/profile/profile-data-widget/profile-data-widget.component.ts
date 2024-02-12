import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-data-widget',
  templateUrl: './profile-data-widget.component.html',
  styleUrls: ['./profile-data-widget.component.scss']
})
export class ProfileDataWidgetComponent implements OnInit {

  isRefresh : boolean = false;
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
