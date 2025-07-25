import { ChangeDetectorRef, Component } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from 'src/app/_helpers/helper.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { LocationService } from './location.service';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss'
})
export class ContentContainerComponent {
  dateControl = new FormControl();
  selectedDate: Date = new Date();
  formattedDate: string = '';
  _locations: any[] = [];
  selectLocationId: number | null = null;
  private ngUnsubscribe = new Subject();

  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private location: LocationService

  ) { }


  ngOnInit(): void {

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    });

    this.getLocation();
  }

    getLocation() {
      this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this._locations = response[0].x;
        console.log("getLocation:", this._locations);
        this.selectLocationId = this._locations[0]?.id;
        console.log("ContentContainerComponent:", this.selectLocationId);
        this.location.setLocation(this._locations[0]?.id);
        this.ref.detectChanges();
      });
    }


    onLocationChange(locationid: number) {
        // this.displayList = [];
        // console.log("changeLocation", locationid);
        // this.selectLocationId = locationid;
        // this.getPatrolInfo(locationid);
        this.selectLocationId = locationid;
        this.location.setLocation(locationid);
      }
    
}
