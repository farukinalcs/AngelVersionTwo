import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';

@Component({
  selector: 'app-profil-tanimlamalar',
  templateUrl: './profil-tanimlamalar.component.html',
  styleUrls: ['./profil-tanimlamalar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        width: '25%'
      })),
      state('out', style({
        width: '100%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),

    trigger('slideInOutReport', [
      state('in', style({
        width: '75%'
      })),
      state('out', style({
        width: '25%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class ProfilTanimlamalarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  reports: any[] = [
    { id: 1, name: 'İzin Tipleri Dosya Gereklilik Tanımı', tip : 'İzin Tipi', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@firma', labelName: 'Firma', type: 'select' }] },
    { id: 2, name: 'FM Nedenleri Dosya Gereklilik Tanımı', tip : 'Fazla Mesai Nedeni', params: [{ name: '@sicil_no', labelName: 'Sicil No', type: 'text' }, { name: '@kart_no', labelName: 'Kart No', type: 'text' }, { name: '@terminal', labelName: 'Terminal', type: 'select' }, { name: '@alt_firma', labelName: 'Alt Firma', type: 'select' }] },
    { id: 3, name: 'Ziyaret Tipleri Dosya Gereklilik Tanımı', tip : 'Ziyaret Tipi', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@sicil_no', labelName: 'Sicil No', type: 'text' }] },
  ];
  selectedItem: any;
  animation: string = 'out';
  animationReport: string = 'in';

  constructor(
    private helperService : HelperService,
  ) {}
  

  ngOnInit(): void {
  }

  toggleDiv(): void {
    this.animation = 'in';
  }

  onSelect(item: any): void {
    this.selectedItem = item;
    this.helperService.configureComponentBehavior.next(item.id);
    console.log("Selected Item: ", this.selectedItem);
  }

  closeAnimation() {
    this.animation = 'out';
    this.selectedItem = undefined;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
