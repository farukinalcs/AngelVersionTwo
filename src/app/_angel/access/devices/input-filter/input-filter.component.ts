import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFilterParams, IDoesFilterPassParams, IFilterComp } from 'ag-grid-community';
@Component({
  // selector: 'app-input-filter',
  // standalone: true,
  // imports: [CommonModule],
  // templateUrl: './input-filter.component.html',
  // styleUrl: './input-filter.component.scss'
  selector: 'input-filter',
  template: `
    <input type="text" (input)="onInput($event)" placeholder="Filtrele..." />
  `,
  styles: [`input { width: 100%;}`]
})
export class InputFilterComponent implements IFilterComp {
  private params: IFilterParams;
  private value: string = '';

  agInit(params: IFilterParams): void {
    this.params = params;
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

    // params.data[field] mevcut değilse veya değeri undefined/null ise
    const cellValue = params.data[field];
    if (cellValue === undefined || cellValue === null) {
        console.error(`Field "${field}" does not exist or is null/undefined in the row data.`);
        return false;
    }

    // Filtreleme işlemi
    return this.value === '' || cellValue.toString().toLowerCase().includes(this.value.toLowerCase());

    //return this.value === '' || params.data[this.params.colDef.field].toString().toLowerCase().includes(this.value.toLowerCase());
  }

  getModel() {
    //return this.value ? { value: this.value } : null;
    return this.isFilterActive() ? { value: this.value } : null;
  }

  setModel(model: any): void {
    this.value = model ? model.value : '';
  }

  // onInput(value: string) {
  //   this.value = value;
  //   this.params.filterChangedCallback();
  // }
  onInput(event: Event) {
    const input = event.target as HTMLInputElement; // Tür belirleme
    this.value = input?.value || ''; // Null kontrolü
    this.params.filterChangedCallback();
  }

  getGui(): HTMLElement {
    // Burada Angular component template'ini doğrudan kullandığımız için, bu metodu uygulamak teknik olarak gerekli değil.
    // Ancak, boş bir div döndürmek bir çözüm olabilir.
    return document.createElement('div');
  }
}
