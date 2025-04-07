import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
  selector: 'app-custom-code-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CustomPipeModule
  ],
  templateUrl: './custom-code-assignment.component.html',
  styleUrl: './custom-code-assignment.component.scss'
})
export class CustomCodeAssignmentComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  filterText: string = "";
  visitTypes: any[] = [];
  selected: any;
  relations: any[] = [];
  purposes: any[];
  selectedPurpose: any;
  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');
  displayUpdate: boolean = false;
  displayAdd: boolean = false;
  customCodes: any[] = [];

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getCustomCodes();
  }

  getCustomCodes() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'ZOkod',
        id: '0',
      },
    ];
    console.log('Zokod Param : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        // "Ad" içerisinde "Belge" ve "Limit" geçenleri filtrele
        this.customCodes = data.filter((item: any) => 
          !item.Ad.includes('Belge') && !item.Ad.includes('Limit')
        );

        this.getVisitTypes();

        console.log('Zokod Geldi : ', this.customCodes);
      });
  }
  
  
  getVisitTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'cbo_ziyaretnedeni',
        id: '0',
      },
    ];
    console.log('Ziyaret Tipleri Param : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.visitTypes = [...data];
        console.log('Ziyaret Tipleri Geldi : ', this.visitTypes);

        this.selectDeviceGroup(this.visitTypes[0]);
      });
  }

  mergeObjects(customCodes: any[], relations: any[]): any[] {
    return relations.map(item => {
      const match = customCodes.find(customCodes => customCodes.Ad === item.kaynakad);
      return { ...item, deger: match ? match.deger : null };
    });
  }

  
  selectDeviceGroup(item: any) {
    this.selected = item;
    this.getRelation();
  }

  getRelation() {
    var sp: any[] = [
      {
        mkodu: 'yek155',
        kaynakid: '0',
        hedefid: this.selected.ID.toString(),
        hedeftablo: 'zokod',
      },
    ];
    console.log('İlişki Param : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.relations = [...data];
        this.relations = this.mergeObjects(this.customCodes, this.relations)
        console.log('İlişki Geldi : ', this.relations);

      });
  }

  relationStateChange(item:any, process:any) {
    var mkodu;
    if (process == "i") {
      mkodu = "yek156"
    } else if (process == "d") {
      mkodu = "yek157"
    }

    var sp: any[] = [
      {
        mkodu: mkodu,
        kaynakid: process == 'd' ? item.kaynakId.toString() : item.ID.toString(),
        hedefid: process == 'd' ? item.hedefId.toString() : this.selected.ID.toString(),
        hedeftablo: 'zokod',
        extra: "0"
        
      },
    ];

    console.log("Ekle-Sil Param: ",sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        console.log('relations durum değişti: ', data);
        this.getRelation();
                
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
