import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ProfileService } from '../../profile/profile.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-survey-in-house',
  standalone: true,
  imports: [CommonModule,TranslateModule,MatTabsModule,DialogModule],
  templateUrl: './survey-in-house.component.html',
  styleUrl: './survey-in-house.component.scss'
})
export class SurveyInHouseComponent implements OnInit, OnDestroy  {

 private ngUnsubscribe = new Subject();
 
  surveyForm: FormGroup;
  allSurveys : boolean;
  selectedItem: any;
  filteredItems: any[] = [];

  mySurveyList:any[] = [];


  items: any[] = [
    { id: '1', tarih: '01 Temmuz 2023', aciklama: 'Kahvaltı Yapalım mı ?', bolum: 'İnsan Kaynakları', selectedOption: null },
    { id: '2', tarih: '02 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '3', tarih: '03 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '4', tarih: '04 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '5', tarih: '05 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Teknik', selectedOption: null },
  ];


  // Tekilleştirilmiş bölümleri içerecek yeni dizi
  uniqueDepartments: any[] = this.getUniqueBolumValues(this.items);

  constructor(
    private profileService : ProfileService,
    private toastrService: ToastrService,
    private ref : ChangeDetectorRef,
    private formBuilder: FormBuilder,
    ) { }

    ngOnInit(){
      this.getMySurvey();
    }

    getUniqueBolumValues(items: any[]) {
      const bolumler: string[] = [];
  
      // Tüm bölümleri dolaşıp bolumler dizisine ekleyin
      for (const item of items) {
        if (!bolumler.includes(item.bolum)) {
          bolumler.push(item.bolum);
        }
      }
  
      return bolumler;
    }

    showAllSurveys() {
      this.allSurveys = true;
    }

    getMySurvey(){
      this.profileService.getMySurvey().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
        this.mySurveyList = response[0].x;
        const message = response[0].z;
        if (message.islemsonuc == -1) {
          return;  
        }
        console.log("getMySurvey : ", this.mySurveyList);
      });
    }

    ngOnDestroy(): void {
      this.ngUnsubscribe.next(true);
      this.ngUnsubscribe.complete();
    }
}
