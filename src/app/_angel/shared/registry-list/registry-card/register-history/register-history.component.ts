import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-register-history',
  templateUrl: './register-history.component.html',
  styleUrls: ['./register-history.component.scss']
})
export class RegisterHistoryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() operationType: any;
  @Input() selectedRegister: any;
  history: any[] = [];
  constructor(
    private profileService: ProfileService
  ) {}
  
  ngOnInit(): void {
    this.getHistory();
  }

  getHistory() {
    var sp: any[] = [
      { mkodu: "yek222", sicilid: this.selectedRegister.Id.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçmiş Geldi :", data);
      this.history = [...data];
      
    });
  }
  
  toggleDetails(item: any) {
    item.expanded = !item.expanded;
  }
  
  
  
  
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
