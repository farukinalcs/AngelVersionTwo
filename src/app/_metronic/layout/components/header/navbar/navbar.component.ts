import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  user$: Observable<UserType>;


  itemClass: string = 'me-5';
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'svg-icon-1';
  imageUrl: string;

  constructor(
    private auth : AuthService,
    private profileService: ProfileService
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {
    this.getCurrentUserInformations();
  }

  getCurrentUserInformations(){
    this.user$ = this.auth.currentUserSubject.asObservable();
  }
}
