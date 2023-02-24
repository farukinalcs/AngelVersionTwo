import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from 'src/app/_helpers/helper.service';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.component.html',
  styleUrls: ['./dialog-container.component.scss']
})
export class DialogContainerComponent implements OnInit {
  
  constructor(
    public  el : ElementRef,
    public dialogRef : MatDialogRef<DialogContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    console.log("DİALOG",this.data)
  }


  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

}
