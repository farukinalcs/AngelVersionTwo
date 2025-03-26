import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-add-temp-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, TranslateModule, SelectModule],
  templateUrl: './add-temp-card.component.html',
  styleUrl: './add-temp-card.component.scss'
})
export class AddTempCardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() visible: boolean; 
  @Output() hideEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  form: FormGroup;
  cards: any[] = [];
  registries: any[] = [];
  
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    private toastrService: ToastrService
  ) { }
  
  ngOnInit(): void {
    this.createForm();
    this.getRegistries();
    this.getVisitorCards();
  }

  onHide() {
    this.hideEvent.emit();
  }
  
  createForm() {
    this.form = this.formBuilder.group({
      registry: ['', Validators.required],
      card: ['', Validators.required],
      explanation: ['', Validators.required]
    });
  }

  add() {
    const formValues = this.getFormValues();
    console.log("formValues: ", formValues);

    var sp: any[] = [
      {
        mkodu: 'yek273',
        bilgi: formValues.explanation,
        giris: '',
        cikis: '',
        userid: formValues.card.userId,
        sicilid: formValues.registry.id.toString()
      }
    ];


    console.log("Geçici kart params: ", sp);
    
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçici Kard Eklendi : ", data);
      this.toastrService.success(
        this.translateService.instant("Geçici_Kart_Eklendi"),
        this.translateService.instant("Başarılı")
      );

      this.onHide();
      this.refreshEvent.emit();
    });
    
  }
  
  getFormValues(): FormModel {
    return this.form.value;
  }

  getVisitorCards() {
    var sp: any[] = [
      {
        mkodu: 'yek275',
        type: 'g'
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.cards = [...data];
      console.log("Ziyaretçi Kartları : ", this.cards);
    });
  }

  getRegistries() {
    var sp: any[] = [
      {
        mkodu: 'yek261',
        id: '0',
        ad: '',
        soyad: '',
        sicilno: '',
        personelno: '', 
        firma: '0',
        bolum: '0',
        pozisyon: '0',
        gorev: '0',
        altfirma: '0',
        yaka: '0',
        direktorluk: '0',
        sicilgroup: '0', 
        userdef: '0',
        cardid: '',
        aktif: '0',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.registries = [...data];
      console.log("Personeller : ", this.registries);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}


export interface FormModel {
  registry: any,
  card: any,
  explanation: string
}
