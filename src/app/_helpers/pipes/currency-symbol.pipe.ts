import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencySymbol',
    standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            case 'TRY': return '₺';
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'RUB': return '₽';
            default: return '₺';
        }
    }

}