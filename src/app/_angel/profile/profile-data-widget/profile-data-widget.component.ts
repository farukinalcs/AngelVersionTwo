import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-profile-data-widget',
  templateUrl: './profile-data-widget.component.html',
  styleUrls: ['./profile-data-widget.component.scss']
})
export class ProfileDataWidgetComponent implements OnInit {

  isRefresh : boolean = false;
  constructor(
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
}
