import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFilterParams, IDoesFilterPassParams, IFilterComp } from 'ag-grid-community';

@Component({
  // selector: 'app-dropdown-filter',
  // standalone: true,
  // imports: [CommonModule],
  // templateUrl: './dropdown-filter.component.html',
  // styles:  [`select { width: 100%;}`]
  selector: 'dropdown-filter',
  template: `
    <select (change)="onChange($event)">
      <option value="">Tümünü Göster</option>
      <option *ngFor="let option of options" [value]="option">{{ option }}</option>
    </select>
  `,
  styles: [`
    select {
      width: 100%;
    }
  `]
})
export class DropdownFilterComponent implements IFilterComp{

  private params: IFilterParams;
  private value: string = '';
  public options: string[] = [];  // Dropdown seçeneklerini buraya ekle

  agInit(params: IFilterParams): void {
    this.params = params;
    this.options = ['Option 1', 'Option 2', 'Option 3']; // Seçenekler
  }

  isFilterActive(): boolean {
    return this.value !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const field = this.params.colDef.field;
    
    // field tanımlı değilse
    if (!field) {
        console.error("colDef.field is not defined.");
        return false;
    }

    // params.data[field] mevcut değilse
    if (params.data[field] === undefined) {
        console.error(`Field "${field}" does not exist in the row data.`);
        return false;
    }

    return this.value === '' || params.data[field] === this.value;

    //return this.value === '' || params.data[this.params.colDef.field] === this.value;
  }

  // getModel() {
  //   return this.value ? { value: this.value } : null;
  // }

  getModel() {
    return this.isFilterActive() ? { value: this.value } : null;
  }

  setModel(model: any): void {
    this.value = model ? model.value : '';
  }

  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Tür dönüşümü
    this.value = selectElement?.value || ''; // Null kontrolü
    this.params.filterChangedCallback();
  }

  getGui(): HTMLElement {
    // Burada Angular component template'ini doğrudan kullandığımız için, bu metodu uygulamak teknik olarak gerekli değil.
    // Ancak, boş bir div döndürmek bir çözüm olabilir.
    return document.createElement('div');
  }
}
