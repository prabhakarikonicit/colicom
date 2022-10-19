import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Pipe({
  name: 'splitBy'
})
export class SplitByPipe implements PipeTransform {
  constructor(private globalService: GlobalService) {

  }
  transform(input: string, type?: string): string[] {
    if (type === 'space') {
      return this.globalService.trustAsHtml(input).split(" ");
    } 
    return this.globalService.trustAsHtml(input).split("");
  }
}
