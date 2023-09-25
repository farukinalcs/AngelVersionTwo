import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-yemek-tipi-tanimlama',
  templateUrl: './yemek-tipi-tanimlama.component.html',
  styleUrls: ['./yemek-tipi-tanimlama.component.scss']
})
export class YemekTipiTanimlamaComponent implements OnInit {

  @Input() selectedItem: any; 
  @Output() closeAnimationEvent = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();

 foodType: any[] = [
    { id: 1, name: 'Ana Yemek'},
    { id: 2, name: 'Corba'},
    { id: 3, name: 'Ara Sıcak'},
    { id: 4, name: 'Salata'},
    { id: 5, name: 'Tatlı'},
    { id: 6, name: 'Diğer'},
  ];

  form : FormGroup;
  selectedType  : any;
  selectedMenu: any;
  selectedValue : any[] = []
  sourceItems: any[] = [];
  targetItems: any[] = [];
  vacationReasons: any[] = [];
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  selected: any;
  demandParam: string = '';
  fileParam: string = '';
  dragDrop : boolean = true; 
  
  constructor(
    private formBuilder: FormBuilder,
    private profileService : ProfileService,
    private translateService : TranslateService,
    private helperService : HelperService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  onCloseButtonClick() {
    this.fileParam = '';
    this.demandParam = '';
    this.closeAnimationEvent.emit();

    this.ref.detectChanges();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
