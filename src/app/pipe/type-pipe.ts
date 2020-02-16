import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TypePipe' })
export class TypePipe implements PipeTransform {
    transform(value: number, ...args: any[]): string {
        switch (value) {
            case 1:
                return '単語';
            case 2:
                return '文';
            case 3:
                return '選択型';
            default:
                return '';
        }
    }
}
