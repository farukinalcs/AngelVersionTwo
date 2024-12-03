import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { FirstSevenPipe } from './pipes/first-seven.pipe';
import { FormatFileSizePipe } from './pipes/format-file-size.pipe';
import { IbanMaskPipe } from './pipes/iban-mask.pipe';
import { PaginationPipe } from './pipes/pagination.pipe';



@NgModule({
  declarations: [
    SearchFilterPipe,
    TimeFormatPipe,
    FirstSevenPipe,
    FormatFileSizePipe,
    IbanMaskPipe,
    PaginationPipe

  ],
  imports: [
    CommonModule
  ],
  exports: [
    SearchFilterPipe,
    TimeFormatPipe,
    FirstSevenPipe,
    FormatFileSizePipe,
    IbanMaskPipe,
    PaginationPipe
    
  ]
})
export class CustomPipeModule { }
