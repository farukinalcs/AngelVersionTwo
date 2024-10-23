import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-form-mails',
  templateUrl: './form-mails.component.html',
  styleUrls: ['./form-mails.component.scss']
})
export class FormMailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  webLink: any;
  state: any;
  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getState();
    this.getLink();
  }

  getState() {
    this.getParameters('taleponaymail');
  }


  getLink() {
    this.getParameters('weblink');
  }

  getParameters(source:any) {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: source,
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Parametres Tanımları: ', data);

        if (data.ad == "weblink") {
          this.webLink = data.deger;
        } else if (data.ad == "TalepFormuMailOnay") {
          this.state = data.deger;
        }
        
        
        
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
