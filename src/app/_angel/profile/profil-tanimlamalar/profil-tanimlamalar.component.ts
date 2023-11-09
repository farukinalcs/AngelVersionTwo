import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';

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


  definitions: any[] = [
    { id: 1, name: 'İzin Tipleri Dosya Gereklilik Tanımı', tip : 'İzin Tipi', demandParam : 'cbo_izintipleri', fileParam : 'izin' },
    { id: 2, name: 'FM Nedenleri Dosya Gereklilik Tanımı', tip : 'Fazla Mesai Nedeni', demandParam : 'cbo_fmnedenleri', fileParam : 'fm' },
    { id: 3, name: 'Ziyaret Tipleri Dosya Gereklilik Tanımı', tip : 'Ziyaret Tipi', demandParam : 'cbo_ziyaretnedeni', fileParam : 'ziyaretci' },
    { id: 4, name: 'Yemek Tipleri Tanımı', tip : 'Yemek Tipi'},
    { id: 5, name: 'Yemek Menü Tanımı', tip : 'Menu Tipi'}];

 


  selectedItem: any;
  animation: string = 'out';
  animationReport: string = 'in';

  constructor(
    private helperService : HelperService,
    public layoutService : LayoutService
  ) {}
  

  ngOnInit(): void {
  }

  toggleDiv(): void {
    this.animation = 'in';
  }

  onSelect(item: any): void {
    this.selectedItem = item;
    
    this.helperService.configureComponentBehavior.next(item);
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
