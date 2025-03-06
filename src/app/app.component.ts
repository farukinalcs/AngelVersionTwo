import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { LoadingService } from './_helpers/loading.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent implements OnInit {
  constructor(
    private modeService: ThemeModeService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.modeService.init();
  }
}
