import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-engages',
  templateUrl: './engages.component.html',
  styleUrls: ['./engages.component.scss']
})
export class EngagesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  title$: Observable<string>;
  constructor(
    private pageInfo: PageInfoService
  ) { }

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
