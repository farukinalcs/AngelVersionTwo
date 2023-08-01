import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dosyalarim',
  templateUrl: './dosyalarim.component.html',
  styleUrls: ['./dosyalarim.component.scss'],
  animations: [
    trigger("fileUploaded", [
      state("uploaded", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: 'translateY(-50%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(200, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class DosyalarimComponent implements OnInit {
  isItUploaded : boolean = false;
  uploadedFile : any;
  src: any;
  constructor(
    private toastrService: ToastrService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  getFile(event : any) {
    this.uploadedFile = event.target.files[0];
    console.log("File : ", this.uploadedFile);

    let fileSize : any = (this.uploadedFile?.size / 1024).toFixed(1);
    let fileSizeType = 'KB';
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      fileSizeType = 'MB';
    }

    this.uploadedFile.fileSize = fileSize + ' ' + fileSizeType;
    console.log("File Size :", this.uploadedFile.fileSize);

    let reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = (event) => {
      this.uploadedFile.url = event.target?.result;
      this.src = event.target?.result;
      this.ref.detectChanges();

    }

  }
}
