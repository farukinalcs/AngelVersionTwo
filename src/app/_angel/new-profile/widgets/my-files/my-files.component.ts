import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss'
})
export class MyFilesComponent implements OnInit {
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