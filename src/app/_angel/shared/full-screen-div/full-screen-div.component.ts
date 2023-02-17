import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-full-screen-div',
  templateUrl: './full-screen-div.component.html',
  styleUrls: ['./full-screen-div.component.scss']
})
export class FullScreenDivComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2
  ) { }

  @Input() div: any;
  @Input() agGrid: any;





  isFullScreen: boolean = false;
  ngOnInit(): void {

  }
  chkScreenMode() {

    if (this.isFullScreen == false) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }
  openFullscreen() {

    document.body.style.overflow = 'hidden';
    let elem = this.document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
 
    if (this.div !== undefined) {
      if (this.div.nativeElement !== undefined) {
        this.div.nativeElement.classList.add('divFullScreen');

      }
    }



    // if (this.agGrid !== "No") {
    //   console.log("this.agGrid full",this.agGrid );
    //   //  this.agGrid.setGridHeight("95vh");
    //   var id : any;
    //   if (window.document.getElementsByClassName("mat-dialog-container")[0] != null) {
    //     id = window.document.getElementsByClassName("mat-dialog-container")[0].id;
    //   }
    //   var offsetHeight = 0;
    //   if (window.document.getElementById(id) != null) {
    //     offsetHeight = window.document.getElementById(id).offsetHeight
   
    //   }

    //   if (offsetHeight == 0) {
    //     offsetHeight = window.document.getElementsByClassName("divFullScreen")[0].clientHeight;

    //   }

    //   this.agGrid.gridSizeRender();
    // }
    // this.divRef.nativeElement.addClassName = 'divFullScreen';
    this.isFullScreen = true;

  }
  /* Close fullscreen */
  closeFullscreen() {


    document.body.style.overflow = 'auto';

    if (this.div !== undefined) {
      if (this.div.nativeElement !== undefined) {
        this.div.nativeElement.classList.remove('divFullScreen');

      }
    }
    // this.div.nativeElement.classList.remove('divFullScreen');

    // if (this.agGrid !== "No") {
    //   console.log("this.agGrid close full setGridHeight",this.agGrid );
    //   this.agGrid.setGridHeight("");
    // }
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullScreen = false;

  }

  ngAfterViewInit() {

  }

}
