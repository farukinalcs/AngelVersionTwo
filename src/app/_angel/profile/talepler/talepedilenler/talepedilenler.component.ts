import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-talepedilenler',
  templateUrl: './talepedilenler.component.html',
  styleUrls: ['./talepedilenler.component.scss']
})
export class TalepedilenlerComponent implements OnInit {

  onayBeklenenForm : any = 4;
  panelOpenState = false;

  // onayBeklenenFormlar : any[] = [
  //   {selected: false, talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı1', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
  //   {selected: false, talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
  //   {selected: false, talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
  //   {selected: false, talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'}
  // ];

  onayBeklenenFormlar : any = {
    completed : false,
    subtasks : [
      {completed: false, talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı1', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
      {completed: false, talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
      {completed: false, talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
      {completed: false, talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'}  
    ]
  };

  onaylananFormlar : any[] = [
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'}
  ];

  reddedilenFormlar : any[] = [
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı1', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
  ];

  selectedItems  : any[] = [];
  isChecked : any;
  checkboxText : any = 'Tümünü Seç';
  allComplete: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  updateAllComplete() {
    this.allComplete = this.onayBeklenenFormlar.subtasks != null && this.onayBeklenenFormlar.subtasks.every((t: any) => t.completed);
  
    console.log("AllComplete :", this.allComplete);    
    console.log("updateAllComplete :", this.onayBeklenenFormlar);    
  }

  someComplete(): boolean {
    if (this.onayBeklenenFormlar.subtasks == null) {
      console.log("someComplete if :", this.onayBeklenenFormlar);    
      
      return false;
    }
    return this.onayBeklenenFormlar.subtasks.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.onayBeklenenFormlar.subtasks == null) {
      console.log("setAll if :", this.onayBeklenenFormlar);    

      return;
    }
    this.onayBeklenenFormlar.subtasks.forEach((t: any) => (t.completed = completed));
    console.log("setAll else :", this.onayBeklenenFormlar);    
  }

  postSelected(){
    let checkedList = this.onayBeklenenFormlar.subtasks.filter((c : any) => {
      return c.completed == true;
    })
    console.log("SELECTED :", checkedList);
    
  }

}
