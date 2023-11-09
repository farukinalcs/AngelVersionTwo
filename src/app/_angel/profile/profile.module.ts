import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfiledashboardComponent } from './profiledashboard/profiledashboard.component';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { GecislerimComponent } from './islemler/gecislerim/gecislerim.component';
import { IzinlerimComponent } from './islemler/izinlerim/izinlerim.component';
import { SurelerimComponent } from './islemler/surelerim/surelerim.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { TalepedilenlerComponent } from './talepler/talepedilenler/talepedilenler.component';
import { TaleplerimComponent } from './talepler/taleplerim/taleplerim.component';
import { ZiyaretcitaleplerimComponent } from './talepler/ziyaretcitaleplerim/ziyaretcitaleplerim.component';
import { MobillokasyonComponent } from './talepler/mobillokasyon/mobillokasyon.component';
import { TasklistemComponent } from './talepler/tasklistem/tasklistem.component';
import { TakimimComponent } from './talepler/takimim/takimim.component';
import { ProfileDataWidgetComponent } from './profile-data-widget/profile-data-widget.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips'
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogLokasyonDetayComponent } from './talepler/mobillokasyon/dialog-lokasyon-detay/dialog-lokasyon-detay.component';
import { DialogFazlaMesaiTalebiComponent } from './talep-olustur/dialog-fazla-mesai-talebi/dialog-fazla-mesai-talebi.component';
import { DialogZiyaretciTalebiComponent } from './talep-olustur/dialog-ziyaretci-talebi/dialog-ziyaretci-talebi.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslationModule } from 'src/app/modules/i18n';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitterModule } from "primeng/splitter";
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CardsModule, ExtrasModule, WidgetsModule } from 'src/app/_metronic/partials';
import { AccordionModule } from 'primeng/accordion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { DialogIzinTalebiComponent } from './talep-olustur/dialog-izin-talebi/dialog-izin-talebi.component';
import { EksikSurelerimComponent } from './islemler/eksik-surelerim/eksik-surelerim.component';
import { TimeFormatPipe } from 'src/app/_helpers/pipes/time-format.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DogumGunuComponent } from './profile-data-widget/dogum-gunu/dogum-gunu.component';
import { YemekMenuComponent } from './profile-data-widget/yemek-menu/yemek-menu.component';
import { YeniKatilanlarComponent } from './profile-data-widget/yeni-katilanlar/yeni-katilanlar.component';
import { DuyurularComponent } from './profile-data-widget/duyurular/duyurular.component';
import { OnerilerComponent } from './profile-data-widget/oneriler/oneriler.component';
import { CarouselModule } from 'primeng/carousel';
import { AnketComponent } from './profile-data-widget/anket/anket.component';
import { KidemlilerComponent } from './profile-data-widget/kidemliler/kidemliler.component';
import { BultenComponent } from './profile-data-widget/bulten/bulten.component';
import { DosyalarimComponent } from './profile-data-widget/dosyalarim/dosyalarim.component';
import { ImageModule } from 'primeng/image';
import { EnvanterComponent } from './profile-data-widget/envanter/envanter.component';
import { DialogAvansTalebiComponent } from './talep-olustur/dialog-avans-talebi/dialog-avans-talebi.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogBultenFormuComponent } from './talep-olustur/dialog-bulten-formu/dialog-bulten-formu.component';
import { DialogDuyuruFormuComponent } from './talep-olustur/dialog-duyuru-formu/dialog-duyuru-formu.component';
import { ProfilTanimlamalarComponent } from './profil-tanimlamalar/profil-tanimlamalar.component';
import { PickListModule } from 'primeng/picklist';
import { DosyaTipiTanimlamaComponent } from './profil-tanimlamalar/dosya-tipi-tanimlama/dosya-tipi-tanimlama.component';
import { FirstSevenPipe } from 'src/app/_helpers/pipes/first-seven.pipe';
import { YemekMenuTumuComponent } from './profile-data-widget/yemek-menu/yemek-menu-tumu/yemek-menu-tumu.component';
import { RatingModule } from 'primeng/rating';
import { UploadedFilesComponent } from './talepler/talepedilenler/uploaded-files/uploaded-files.component';

import { VisitorUploadedFilesComponent } from './talepler/ziyaretcitaleplerim/visitor-uploaded-files/visitor-uploaded-files.component';
import { DataNotFoundComponent } from '../shared/data-not-found/data-not-found.component';
import { FormStepperComponent } from '../shared/form-stepper/form-stepper.component';
import { OngoingRequestsComponent } from './talepler/taleplerim/ongoing-requests/ongoing-requests.component';
import { ApprovedRequestsComponent } from './talepler/taleplerim/approved-requests/approved-requests.component';
import { DeniedRequestsComponent } from './talepler/taleplerim/denied-requests/denied-requests.component';
import { DetailSearchComponent } from '../shared/detail-search/detail-search.component';
import { RequestProcessComponent } from '../shared/request-process/request-process.component';
import { RequestMenuComponent } from '../shared/request-menu/request-menu.component';
import { FormatFileSizePipe } from 'src/app/_helpers/pipes/format-file-size.pipe';
import { VisitorRequestsComponent } from './talepler/visitor-requests/visitor-requests.component';
import { DialogYetkiTalebiComponent } from './talep-olustur/dialog-yetki-talebi/dialog-yetki-talebi.component';

import { YemekTipiTanimlamaComponent } from './profil-tanimlamalar/yemek-tipi-tanimlama/yemek-tipi-tanimlama.component';
import { YemekMenuTanimlamaComponent } from './profil-tanimlamalar/yemek-menu-tanimlama/yemek-menu-tanimlama.component';
import { SicilListeComponent } from '../shared/sicil-liste/sicil-liste.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise';
import { DialogAracTalebiComponent } from './talep-olustur/dialog-arac-talebi/dialog-arac-talebi.component';
import { IbanMaskPipe } from 'src/app/_helpers/pipes/iban-mask.pipe';
import { PendingRequestsComponent } from './talepler/talepedilenler/pending-requests/pending-requests.component';


LicenseManager.setLicenseKey(
  "BOARD4ALL_NDEwMjM1MTIwMDAwMA==8f4481b5cc626ad79fe91bc5f4e52e3d"
);

@NgModule({
  declarations: [
    ProfiledashboardComponent,
    GecislerimComponent,
    IzinlerimComponent,
    SurelerimComponent,
    TalepedilenlerComponent,
    TaleplerimComponent,
    ZiyaretcitaleplerimComponent,
    MobillokasyonComponent,
    TasklistemComponent,
    TakimimComponent,
    ProfileDataWidgetComponent,
    DialogLokasyonDetayComponent,
    DialogFazlaMesaiTalebiComponent,
    DialogZiyaretciTalebiComponent,
    SearchFilterPipe,
    DialogIzinTalebiComponent,
    EksikSurelerimComponent,
    TimeFormatPipe,
    DogumGunuComponent,
    YemekMenuComponent,
    YeniKatilanlarComponent,
    DuyurularComponent,
    OnerilerComponent,
    AnketComponent,
    KidemlilerComponent,
    BultenComponent,
    DosyalarimComponent,
    EnvanterComponent,
    DialogAvansTalebiComponent,
    DialogBultenFormuComponent,
    DialogDuyuruFormuComponent,
    ProfilTanimlamalarComponent,
    DosyaTipiTanimlamaComponent,
    FirstSevenPipe,
    YemekMenuTumuComponent,
    UploadedFilesComponent,

    VisitorUploadedFilesComponent,
    DataNotFoundComponent,
    FormStepperComponent,
    OngoingRequestsComponent,
    ApprovedRequestsComponent,
    DeniedRequestsComponent,
    DetailSearchComponent,
    RequestProcessComponent,
    RequestMenuComponent,
    FormatFileSizePipe,
    VisitorRequestsComponent,
    DialogYetkiTalebiComponent,
    YemekTipiTanimlamaComponent,
    YemekMenuTanimlamaComponent,
    SicilListeComponent,
    DialogAracTalebiComponent,
    IbanMaskPipe,
    PendingRequestsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfiledashboardComponent,
      },
    ]),
    InlineSVGModule,
    MatTabsModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    TranslationModule,
    OverlayPanelModule,
    SplitterModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    TimelineModule,
    CardModule,
    CardsModule, // Metronic içinden module
    AccordionModule,
    MatTooltipModule,
    DataViewModule,
    DropdownModule,
    NgApexchartsModule,
    MatProgressSpinnerModule,
    WidgetsModule,
    CarouselModule,
    ImageModule,
    FullCalendarModule,
    ExtrasModule,
    PickListModule,
    RatingModule,
    AgGridModule
  ],
  // providers:[ProfileService]

})
export class ProfileModule { }
