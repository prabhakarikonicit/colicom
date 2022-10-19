import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
@Pipe({
  name: 'version'
})
export class VersionPipe implements PipeTransform {
  transform(value: string): string {
    return String(value).replace(/\%VERSION\%/mg, environment.VERSION);
  }
}
