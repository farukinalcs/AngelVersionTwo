import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance-restriction',
  templateUrl: './attendance-restriction.component.html',
  styleUrls: ['./attendance-restriction.component.scss'],
})
export class AttendanceRestrictionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  startDate: any;
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAttendanceRestriction();
  }

  getAttendanceRestriction() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'pdksblock',
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
        console.log('PDKS Kısıt : ', data);

        data.forEach((item:any) => {
          if (item.ad == "pdkskilittarih") {
            this.startDate = item.deger;
          }
        })
      });
  }
//Dikkat !!! \n <br><br> Pdks ' + $("#pdksblokbastarih").val() + ' itibari ile kilitlenecek ilgili tarih öncesinde müdahale yapılamayacaktır. <br><br>Onaylıyor musunuz ?
  save() {
    Swal.fire({
      title: `Dikkat PDKS ${this.startDate} itibari ile kilitlenecek ilgili tarih öncesinde müdahale yapılamayacaktır!`,
      // text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#ed1b24',
      showCancelButton: true,
      confirmButtonColor: '#ed1b24',
      cancelButtonColor: '#ed1b24',
      cancelButtonText: 'Vazgeç',
      confirmButtonText: `Evet, Onayla!`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        
        var sp: any[] = [
          {
            mkodu: 'yek126',
            tarih: this.startDate,
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
            console.log('PDKS Kısıt : ', data);

            this.getAttendanceRestriction();
          });


        Swal.fire({
          title: `Talep Onaylandı!`,
          // text: "Your file has been deleted.",
          icon: 'success',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'İşlem Yapmaktan Vazgeçildi!',
          // text: "Your imaginary file is safe :)",
          icon: 'error',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
