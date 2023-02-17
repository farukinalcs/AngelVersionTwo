import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
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

  user$: Observable<UserType>;

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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCurrentUserInformations();
    this.setVekilForm();
    this.filtered();
  }

  openDialog(component : any) {
    this.dialog.open(component);
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
