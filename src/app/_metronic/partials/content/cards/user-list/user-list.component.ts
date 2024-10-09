import { Component, Input, OnInit } from '@angular/core';
import { DemandedModel } from 'src/app/_angel/profile/models/demanded';
import { IconUserModel } from '../icon-user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  // @Input() users: Array<IconUserModel> = [];
  @Input() users: Array<DemandedModel> = [];


  constructor() {}

  ngOnInit(): void {
    console.log("USER LIST :", this.users);
    
  }
}
