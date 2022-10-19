import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(values: any[], propertyName: string, order: boolean = false): any[] {
    if (propertyName) {
      return values.sort((value1: any, value2: any) => {
        return order ? value2[propertyName] - value1[propertyName] : value1[propertyName] - value2[propertyName];
      });
    } else {
      return values;
    }
  }

}
