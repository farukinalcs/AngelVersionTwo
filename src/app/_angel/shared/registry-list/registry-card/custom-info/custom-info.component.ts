import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, take, takeUntil, throwError } from 'rxjs';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-custom-info',
  templateUrl: './custom-info.component.html',
  styleUrls: ['./custom-info.component.scss'],
})
export class CustomInfoComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() inputValue!: number;
  @Input() selectedRegister: any;
  @Input() operationType: any;
  @Input() checkFormController: any;
  form!: FormGroup;
  customCodes: any[] = [];
  display: boolean;
  selectedItem: any;
  newName: any;
  selectedFormType: any;
  registerDetail: any[] = [];
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private store: Store<{ form: FormState }>
  ) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({});
    this.getCustomInfo();
  }

  ngOnChanges() {
    // if (this.operationType == 'u') {
    //   this.setFormValue();
    // }
  }

  getCustomInfo() {
    var sp: any[] = [
      { mkodu: 'yek205', id: '0'}
    ];
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      let data = response[0].x;
      const message = response[0].z;
      if (message.islemsonuc == -1) {
        return;
      }
      data = data.map((item:any, index:any) => ({
        ...item,
        controlName: `okod${index + 1}`
      }));

      // if (this.operationType == 't') {
      //   data.forEach((item:any,index:any) => {
      //     this.checkFormController[`okod${index + 1}`] = undefined;
      //   });
      //   console.log("Testoo : ", this.checkFormController);
        
      // }
      console.log("OKod : ", data);
      this.customCodes = [...data];
      this.createForm(data);

      this.store.select('form').pipe(take(1)).subscribe((state) => {
        if (!state.customInfo && this.operationType == 'u') {
          this.getRegisterDetail();
        }
      });
    });
  }

  createForm(data: any[]): void {
    const group: any = {};

    data.forEach(item => {
      group[item.controlName] = [""];
    });
    this.form = this.fb.group(group);


    // Store ile bağlan
    this.saveFormToStore();

    // State'ten gelen veriyi yükle
    this.store.select('form').pipe(take(1)).subscribe((state) => {
      if (state.customInfo) {
        this.form.patchValue(state.customInfo, { emitEvent: false });
      }
    });
  }

  showEdit(item:any) {
    this.display = true;
    this.selectedItem = item;
    this.newName = item.ad
    this.selectedFormType = item.type
  }
  
  closeEdit() {
    this.display = false;
  }


  editCustomCode() {
    var sp: any[] = [
      { mkodu: 'yek204', okod: this.selectedItem.okodtype, deger: this.selectedFormType },
      { mkodu: 'yek204', okod: this.selectedItem.okodtype, deger: this.selectedFormType },
      { mkodu: 'yek204', okod: this.selectedItem.okodtype, deger: this.selectedFormType },
      { mkodu: 'yek208', ad: this.newName, id: this.selectedItem.ID.toString() }
    ];
  
    console.log("Form Tipi Güncelle Param :", sp);
  
    this.profileService.processMultiPost(sp)
      .then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
  
        return reader?.read().then(function processText({ done, value }): any {
          if (done) {
            console.log("İşlem tamamlandı.");
            return;
          }
  
          let text = decoder.decode(value, { stream: true });
          console.log("Gelen veri (Stream):", text);

          if (text.startsWith('[') && text.endsWith(']')) {
            console.log("Yanıt Boş Geldi :", text);
            return;
          }
          
          if (text.startsWith('[')) {
            text = text.replace('[','');
          }

          if (text.startsWith(',') && !text.endsWith(']')) {
            text = text.replace(',','');
          }
          
          if (text.startsWith(',') && text.endsWith(']')) {
            text = text.replace(',','');
            const lastIndex = text.lastIndexOf("]");

            if (lastIndex !== -1) {
              const newText = text.substring(0, lastIndex) + text.substring(lastIndex + 1);
              text = newText;
            }
          }

          const formattedText = JSON.parse(text);
          console.log("Formatted Text :", formattedText);           
          return reader?.read().then(processText);
        });
      })
      .catch(error => {
        console.error("Hata oluştu:", error);
      });
  }

  
  
  
  
  
  
  
  
  
  
  
  
  // editCustomCode() {
  //   var sp: any[] = [
  //     { mkodu: 'yek204', okod: this.selectedItem.okodtype, deger: this.selectedFormType },
  //     { mkodu: 'yek208', ad: this.newName, id: this.selectedItem.ID.toString() }
  //   ];
  
  //   console.log("Form Tipi Güncelle Param :", sp);
  
  //   this.profileService.requestMethodd(sp)
  //     .then(response => {
  //       const reader = response.body?.getReader();
  //       const decoder = new TextDecoder();
  //       let accumulatedData = ""; // Gelen veriyi biriktirmek için
  //       let processedArray: any[] = []; // Düzeltilmiş JSON elemanlarını tutan dizi
  
  //       return reader?.read().then(function processText({ done, value }): any {
  //         if (done) {
  //           console.log("İşlem tamamlandı. Tam JSON:", processedArray);
  //           return;
  //         }
  
  //         const text = decoder.decode(value, { stream: true });
  //         accumulatedData += text; 
  
  //         
  //         accumulatedData = accumulatedData.replace(/^\[/, "").replace(/\]$/, "");
  
  //         
  //         let jsonStrings = accumulatedData.split(/,(?=\{)/); 
  
  //         jsonStrings.forEach(jsonStr => {
  //           try {
  //             const parsedItem = JSON.parse(jsonStr);
  //             processedArray.push(parsedItem); 
  //           } catch (error) {
  //             console.warn("Henüz tam JSON oluşmadı, devam ediliyor...");
  //           }
  //         });
  
  //         return reader?.read().then(processText);
  //       });
  //     })
  //     .catch(error => {
  //       console.error("Hata oluştu:", error);
  //     });
  // }
  
  

  getRegisterDetail() {
    var sp: any[] = [
      { mkodu: 'yek209', id: this.selectedRegister?.Id.toString() }
    ];
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;
      if (message.islemsonuc == -1) {
        return;  
      }
      console.log("Sicil Detay Geldi : ", data);
      this.registerDetail = [...data];
      this.setFormValue();
    });
  }

  setFormValue() {
    const okodFields = Array.from({ length: 20 }, (_, i) => `okod${i + 1}`);
    const registerDetail = this.registerDetail[0];
  
    okodFields.forEach(field => {
      const value = registerDetail?.[field];
      this.form?.get(field)?.setValue(value);
    });
  }

  saveFormToStore() {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value:any) => {
      this.store.dispatch(updateForm({ formName: 'customInfo', formData: this.form.value }));
    });    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
