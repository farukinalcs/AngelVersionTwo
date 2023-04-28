import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { HelperService } from 'src/app/_helpers/helper.service';
import { DialogFazlaMesaiTalebiComponent } from '../talep-olustur/dialog-fazla-mesai-talebi/dialog-fazla-mesai-talebi.component';
import { DialogGunlukIzinTalebiComponent } from '../talep-olustur/dialog-gunluk-izin-talebi/dialog-gunluk-izin-talebi.component';
import { DialogSaatlikIzinTalebiComponent } from '../talep-olustur/dialog-saatlik-izin-talebi/dialog-saatlik-izin-talebi.component';
import { DialogZiyaretciTalebiComponent } from '../talep-olustur/dialog-ziyaretci-talebi/dialog-ziyaretci-talebi.component';

@Component({
  selector: 'app-profiledashboard',
  templateUrl: './profiledashboard.component.html',
  styleUrls: ['./profiledashboard.component.scss']
})
export class ProfiledashboardComponent implements OnInit {

  private unsubscribe: Subscription[] = [];

  user$: Observable<UserType>;

  links : any[] = [
    {name: 'Geçişlerim', translate: 'MENU.PROFIL_SUB.GECISLERIM', link: 'gecislerim'},
    {name: 'Sürelerim', translate: 'MENU.PROFIL_SUB.SURELERIM', link: 'surelerim'},
    {name: 'İzinlerim', translate: 'MENU.PROFIL_SUB.IZINLERIM', link: 'izinlerim'},
    {name: 'Talep Edilenler', translate: 'MENU.PROFIL_SUB.TALEP_EDILENLER', link: 'talep_edilenler'},
    {name: 'Taleplerim', translate: 'MENU.PROFIL_SUB.TALEPLERIM', link: 'taleplerim'},
    {name: 'Ziyaretçi Taleplerim', translate: 'MENU.PROFIL_SUB.ZIYARETCI_TALEPLERIM', link: 'ziyaretci_taleplerim'},
    {name: 'Mobil Lokasyon', translate: 'MENU.PROFIL_SUB.MOBIL_LOKASYON', link: 'mobil_lokasyon'},
    {name: 'Task Listem', translate: 'MENU.PROFIL_SUB.TASK_LISTEM', link: 'task_listem'},
    {name: 'Takımım', translate: 'MENU.PROFIL_SUB.TAKIMIM', link: 'takimim'},
  ];

  myControl : any = FormGroup;
  options: string[] = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];
  filteredOptions: Observable<string[]>;


  dialogFazlaMesaiComponent = DialogFazlaMesaiTalebiComponent;
  dialogZiyaretciComponent = DialogZiyaretciTalebiComponent;
  dialogGunlukIzinComponent = DialogGunlukIzinTalebiComponent;
  dialogSaatlikIzinComponent = DialogSaatlikIzinTalebiComponent;

  constructor(
    private auth: AuthService,
    private fomrBuilder : FormBuilder,
    public dialog: MatDialog,
    private helper : HelperService
  ) { }

  ngOnInit(): void {
    this.getCurrentUserInformations();
    this.setVekilForm();
    this.filtered();
  }

  openDialog(component: any) {
    this.dialog.open(component);

    // var dialogRes = this.helper.dynamicDialog(false, '530px', '550px', 'fmTalepFormu', 'form', this.dialog, this);

    // const ruleDialogSubs = dialogRes.afterClosed().subscribe((result: any) => {
    //   this.helper.refreshComponent(this);
                          
    //   if (result == "OK") {
    //     console.log("result :", result);
        
    //   }

    // });

    // this.unsubscribe.push(ruleDialogSubs);
  }  

  getCurrentUserInformations() {
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  setVekilForm() {
    this.myControl = this.fomrBuilder.group({
      vekilSec : ['']
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filtered() {
    this.filteredOptions = this.myControl.get("vekilSec").valueChanges.pipe(
      startWith(''),
      map((value : any) => this._filter(value || '')),
    );
  }



}
