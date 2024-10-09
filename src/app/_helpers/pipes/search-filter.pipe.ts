import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any[], filterText: string, searchFields: string[]): any[] {
    filterText = filterText ? filterText.toLocaleLowerCase() : "";
    
    return filterText ? value.filter((c: any) => {
      
      const allFields = searchFields.map((field) => c[field]).join(' ');
      return allFields.toLocaleLowerCase().indexOf(filterText) !== -1;
      
    }) : value;
  }

}
