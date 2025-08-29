import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
      CommonModule,
        FormsModule,
        DialogModule,
        TranslateModule,
        CustomPipeModule,
        TooltipModule,
        InputIconModule,
        IconField,
        FloatLabelModule,
        InputTextModule
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  private ngUnsubscribe = new Subject();
    loading: boolean = true;

  constructor(
        private translateService: TranslateService,
        private profileService: ProfileService,
        private toastrService: ToastrService,
  ){}

    ngOnInit(): void {

  }

    

   ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
