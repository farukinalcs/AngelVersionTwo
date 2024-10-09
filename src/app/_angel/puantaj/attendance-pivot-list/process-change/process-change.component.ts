import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-process-change',
  templateUrl: './process-change.component.html',
  styleUrls: ['./process-change.component.scss']
})
export class ProcessChangeComponent implements OnInit, OnDestroy {
  @Input() displayProcessChange: boolean = true;
  @Output() displayProcessChangeEvent: EventEmitter<void> = new EventEmitter<void>();
  private ngUnsubscribe = new Subject();
  processLoading: boolean;
  processChangeList: any[] = [];

  constructor(
    public profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getProcessChangeList();
    
  }

  getProcessChangeList() {
    this.processLoading = false;
    var sp: any[] = [
      {mkodu: 'yek119'}
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        
        this.processChangeList = data;
        console.log('Pivot Özet (s) : ', data);
        
        this.processLoading = true;
      });
  }
  
  hideProcessChange() {
    this.displayProcessChangeEvent.emit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
