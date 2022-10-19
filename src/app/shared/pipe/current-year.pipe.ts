import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentYear'
})
export class CurrentYearPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return new Date().getUTCFullYear();
  }

}
