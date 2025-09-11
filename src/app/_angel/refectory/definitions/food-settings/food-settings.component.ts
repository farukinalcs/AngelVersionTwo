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
  selector: 'app-food-settings',
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
    InputTextModule,
  ],
  templateUrl: './food-settings.component.html',
  styleUrl: './food-settings.component.scss',
})
export class FoodSettingsComponent {
  private ngUnsubscribe = new Subject();
  loading: boolean = true;
  piece: number | null = null;
  private lastSentPiece: number | null = null;
  constructor(
    private translateService: TranslateService,
    private profileService: ProfileService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getFoodPiece();
  }

  getFoodPiece() {
    var sp: any[] = [
      {
        mkodu: 'yek410',
      },
    ];

    console.log('Terminal Grubu Ekle Param : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        this.piece = data[0].sayi;
        console.log('Terminal Grubu Eklendi : ', data);
      });
  }

  onPieceChange(val: any) {
    if (val === '' || val === null || val === undefined) {
      this.piece = null;
      return;
    }

    const n = Number(val);
    if (!Number.isFinite(n)) return;

    let use = Math.trunc(n);

    if (use > 99) {
      use = 99;
      this.piece = use;
    } else {
      this.piece = use;
    }

    if (use >= 1 && use <= 99) {
      if (this.lastSentPiece !== use) {
        this.updateFoodPiece(use);
        this.lastSentPiece = use;
      }
    }
  }

  onPieceBlur() {
    if (this.piece == null || this.piece < 1) {
      this.piece = 1;
      if (this.lastSentPiece !== 1) {
        this.updateFoodPiece(1);
        this.lastSentPiece = 1;
      }
    }
  }

  updateFoodPiece(p?: number) {
    const val = p ?? this.piece;
    if (val == null || !Number.isFinite(val)) return;

    const sp: any[] = [
      {
        mkodu: 'yek411',
        sayi: String(val),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response?.[0]?.x;
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) return;

          this.getFoodPiece?.();
          this.toastrService?.success(
            this.translateService?.instant('Atama_Başarılı') ?? 'Atama_Başarılı'
          );
        },
        (err) => {
          console.error('updateFoodPiece error:', err);
          this.toastrService?.error(
            this.translateService?.instant('Hata') ?? 'Hata'
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
