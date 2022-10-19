import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Pipe({
  name: 'filterKeyVal'
})
export class FilterKeyValPipe implements PipeTransform {
  constructor(private globalService:GlobalService){}
  transform(items: any[], filter: any): any {
    return this.globalService.filterKeyVal(items, filter);
  }
}
