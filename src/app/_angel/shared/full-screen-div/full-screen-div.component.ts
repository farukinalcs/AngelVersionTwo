import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { HelperService } from 'src/app/_helpers/helper.service';

@Component({
  selector: 'app-full-screen-div',
  templateUrl: './full-screen-div.component.html',
  styleUrls: ['./full-screen-div.component.scss']
})
export class FullScreenDivComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private helper : HelperService
  ) { }

  @Input() div: any;
  @Input() refComponent: any;





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



    this.isFullScreen = true;
    if (this.refComponent?.dashboardItemViewSize != undefined) {

      this.refComponent.dashboardItemViewSize = undefined;

      setTimeout(() => {
        if (this.refComponent?.chartsDetail != undefined) {


          this.refComponent.dashboardItemViewSize = [this.refComponent?.chartsDetail.width - 60, this.refComponent?.chartsDetail.height - 170]
        }

        this.helper.refreshComponent(this.refComponent);

      }, 2000);
    }

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
