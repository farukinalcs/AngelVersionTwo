import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ILayout, LayoutType } from '../../core/configs/config';
import { LayoutService } from '../../core/layout.service';
import { PageInfoService, PageLink } from '../../core/page-info.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  // Public props
  @Input() currentLayoutType: LayoutType | null;
  @Input() appToolbarLayout:
    | 'classic'
    | 'accounting'
    | 'extended'
    | 'reports'
    | 'saas';

  // toolbar
  appToolbarDisplay: boolean;
  appToolbarContainer: 'fixed' | 'fluid';
  appToolbarContainerCSSClass: string = '';
  appToolbarFixedDesktop: boolean;
  appToolbarFixedMobile: boolean;
  appPageTitleDisplay: boolean;

  // page title
  appPageTitleDirection: string = '';
  appPageTitleCSSClass: string = '';
  appPageTitleBreadcrumb: boolean;
  appPageTitleDescription: boolean;

  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;
  pageTitle: string = '';

  constructor(private layout: LayoutService, private pageInfo : PageInfoService, private router : Router) {}

  ngOnInit(): void {
    const subscr = this.layout.layoutConfigSubject
      .asObservable()
      .subscribe((config: ILayout) => {
        this.updateProps(config);
      });
    this.unsubscribe.push(subscr);
  }

  updateProps(config: ILayout) {
    this.appToolbarDisplay = this.layout.getProp(
      'app.toolbar.display',
      config
    ) as boolean;
    if (!this.appToolbarDisplay) {
      return;
    }

    this.appPageTitleDisplay = this.layout.getProp(
      'app.pageTitle.display',
      config
    ) as boolean;
    this.appToolbarContainer = this.layout.getProp(
      'app.toolbar.container',
      config
    ) as 'fluid' | 'fixed';
    this.appToolbarContainerCSSClass =
      this.appToolbarContainer === 'fixed'
        ? 'container-xxl'
        : 'container-fluid';
    const containerClass = this.layout.getProp(
      'app.toolbar.containerClass',
      config
    ) as string;
    if (containerClass) {
      this.appToolbarContainerCSSClass += ` ${containerClass}`;
    }

    this.appToolbarFixedDesktop = this.layout.getProp(
      'app.toolbar.fixed.desktop',
      config
    ) as boolean;
    if (this.appToolbarFixedDesktop) {
      document.body.setAttribute('data-kt-app-toolbar-fixed', 'true');
    }

    this.appToolbarFixedMobile = this.layout.getProp(
      'app.toolbar.fixed.mobile',
      config
    ) as boolean;
    if (this.appToolbarFixedMobile) {
      document.body.setAttribute('data-kt-app-toolbar-fixed-mobile', 'true');
    }

    // toolbar
    this.appPageTitleDirection = this.layout.getProp(
      'app.pageTitle.direction',
      config
    ) as string;
    this.appPageTitleCSSClass = this.layout.getProp(
      'app.pageTitle.class',
      config
    ) as string;
    this.appPageTitleBreadcrumb = this.layout.getProp(
      'app.pageTitle.breadCrumb',
      config
    ) as boolean;
    this.appPageTitleDescription = this.layout.getProp(
      'app.pageTitle.description',
      config
    ) as boolean;

    document.body.setAttribute('data-kt-app-toolbar-enabled', 'true');
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  showPageTitle() {
    const viewsWithPageTitles = ['classic', 'reports', 'saas'];
    return (
      this.appPageTitleDisplay &&
      viewsWithPageTitles.some((t) => t === this.appToolbarLayout)
    );
  }

  setPageTitle() {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    console.log("appPageTitleDescription : ", this.appPageTitleDescription);
    
    let pageTitle;
    this.title$.subscribe(v => {
      this.pageTitle = v;
      pageTitle = v;
      console.log("title$ : ", v);
    });

    if (
      pageTitle == '' ||
      pageTitle == 'Light' ||
      pageTitle == 'Genel Bakış' ||
      pageTitle == 'Dashboard' ||
      pageTitle == 'Geçişlerim' ||
      pageTitle == 'Sürelerim' ||
      pageTitle == 'İzinlerim' ||
      pageTitle == 'Talep Edilenler' ||
      pageTitle == 'Taleplerim' ||
      pageTitle == 'Ziyaretçi Taleplerim' ||
      pageTitle == 'Mobil Lokasyon' ||
      pageTitle == 'Task Listem' ||
      pageTitle == 'Takımım' ||
      pageTitle == 'Eksik Sürelerim' ||
      pageTitle == 'My Transitions' ||
      pageTitle == 'My Durations' ||
      pageTitle == 'My Permission' ||
      pageTitle == 'Requested Things' ||
      pageTitle == 'My Demands' ||
      pageTitle == 'My Visitor Requests' ||
      pageTitle == 'Mobile Location' ||
      pageTitle == 'My Task List' ||
      pageTitle == 'My Team' ||
      pageTitle == 'Incomplete Time'
    ) {
      this.router.navigate(['profile/definitions']);
    } else if (
      pageTitle == 'Pdks' ||
      pageTitle == 'Pdks Pivot'
    ) {
      this.router.navigate(['puantaj/definitions']);
    } else {
      this.router.navigate(['access/definitions']);
    }

    this.description$.subscribe(v => {
      console.log("description$ : ", this.description$);
    });

    this.bc$.subscribe(v => {
      console.log("bc$ : ", this.bc$);
    });
  }
}
