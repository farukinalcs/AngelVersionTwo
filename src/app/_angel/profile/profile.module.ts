import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogLokasyonDetayComponent } from './talepler/mobillokasyon/dialog-lokasyon-detay/dialog-lokasyon-detay.component';
import { DialogFazlaMesaiTalebiComponent } from './talep-olustur/dialog-fazla-mesai-talebi/dialog-fazla-mesai-talebi.component';
import { DialogZiyaretciTalebiComponent } from './talep-olustur/dialog-ziyaretci-talebi/dialog-ziyaretci-talebi.component';
import { TranslationModule } from 'src/app/modules/i18n';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardsModule, ExtrasModule, WidgetsModule } from 'src/app/_metronic/partials';
import { AccordionModule } from 'primeng/accordion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { DialogIzinTalebiComponent } from './talep-olustur/dialog-izin-talebi/dialog-izin-talebi.component';
import { EksikSurelerimComponent } from './islemler/eksik-surelerim/eksik-surelerim.component';
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
import { EnvanterComponent } from './profile-data-widget/envanter/envanter.component';
import { DialogAvansTalebiComponent } from './talep-olustur/dialog-avans-talebi/dialog-avans-talebi.component';
import { DialogBultenFormuComponent } from './talep-olustur/dialog-bulten-formu/dialog-bulten-formu.component';
import { DialogDuyuruFormuComponent } from './talep-olustur/dialog-duyuru-formu/dialog-duyuru-formu.component';
import { PickListModule } from 'primeng/picklist';
import { YemekMenuTumuComponent } from './profile-data-widget/yemek-menu/yemek-menu-tumu/yemek-menu-tumu.component';
import { RatingModule } from 'primeng/rating';
import { UploadedFilesComponent } from './talepler/talepedilenler/uploaded-files/uploaded-files.component';

import { VisitorUploadedFilesComponent } from './talepler/ziyaretcitaleplerim/visitor-uploaded-files/visitor-uploaded-files.component';
import { OngoingRequestsComponent } from './talepler/taleplerim/ongoing-requests/ongoing-requests.component';
import { ApprovedRequestsComponent } from './talepler/taleplerim/approved-requests/approved-requests.component';
import { DeniedRequestsComponent } from './talepler/taleplerim/denied-requests/denied-requests.component';
import { VisitorRequestsComponent } from './talepler/visitor-requests/visitor-requests.component';
import { DialogYetkiTalebiComponent } from './talep-olustur/dialog-yetki-talebi/dialog-yetki-talebi.component';


import 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise';
import { DialogAracTalebiComponent } from './talep-olustur/dialog-arac-talebi/dialog-arac-talebi.component';
import { PendingRequestsComponent } from './talepler/talepedilenler/pending-requests/pending-requests.component';

import { DialogMasrafTalebiComponent } from './talep-olustur/dialog-masraf-talebi/dialog-masraf-talebi.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { SharedModule } from '../shared/shared.module';
import { ShiftChangeFormComponent } from './talep-olustur/shift-change-form/shift-change-form.component';
import { AttendanceChangeFormComponent } from './talep-olustur/attendance-change-form/attendance-change-form.component';
import { TooltipModule } from 'primeng/tooltip';
import { ProfileDefinitionsComponent } from './profile-definitions/profile-definitions.component';
import { FileTypeDefinitionComponent } from './profile-definitions/definitions/file-type-definition/file-type-definition.component';
import { MenuDefinitionComponent } from './profile-definitions/definitions/menu-definition/menu-definition.component';
import { FoodTypeDefinitionComponent } from './profile-definitions/definitions/food-type-definition/food-type-definition.component';
import { InputMaskModule } from 'primeng/inputmask';

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
    DialogIzinTalebiComponent,
    EksikSurelerimComponent,
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
    YemekMenuTumuComponent,
    UploadedFilesComponent,
    VisitorUploadedFilesComponent,
    OngoingRequestsComponent,
    ApprovedRequestsComponent,
    DeniedRequestsComponent,
    VisitorRequestsComponent,
    DialogYetkiTalebiComponent,
    DialogAracTalebiComponent,
    PendingRequestsComponent,
    DialogMasrafTalebiComponent,
    ShiftChangeFormComponent,
    AttendanceChangeFormComponent,
    ProfileDefinitionsComponent,
    FileTypeDefinitionComponent,
    MenuDefinitionComponent,
    FoodTypeDefinitionComponent
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
    MatExpansionModule,
    MatMenuModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    TranslationModule,
    DialogModule,
    ButtonModule,
    TimelineModule,
    CardsModule, // Metronic içinden module
    AccordionModule,
    MatTooltipModule, // !!! Kullanımdan Kaldırılacak !!!
    DropdownModule,
    MatProgressSpinnerModule,
    WidgetsModule,
    CarouselModule,
    ExtrasModule,
    PickListModule, // !!! Kullanımdan Kaldırılacak !!!
    RatingModule,
    CustomPipeModule,
    SharedModule,
    TooltipModule,
    InputMaskModule
  ],
  exports: [
    DialogIzinTalebiComponent,
    DialogFazlaMesaiTalebiComponent,
    ShiftChangeFormComponent,
    AttendanceChangeFormComponent
  ],
  providers:[DatePipe]

})
export class ProfileModule { }
