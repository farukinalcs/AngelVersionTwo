import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-activity-drawer',
  templateUrl: './activity-drawer.component.html',
})
export class ActivityDrawerComponent implements OnInit {
  @Input() assignmentLog: any[] = []; 
  imageUrl: any;
  constructor(
    private profileService: ProfileService
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {
    console.log("ActivityDrawerComponent : ", this.assignmentLog);
    
  }
}
