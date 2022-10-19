import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlToEnvironment'
})
export class UrlToEnvironmentPipe implements PipeTransform {

  transform(value: string): string {
    const parser: HTMLAnchorElement = document.createElement('a');
    parser.href = value;

    if (location.host.substr(1, 1) === '-') {
      parser.host = location.host.substr(0, 2) + parser.host;
    }

    return parser.toString();
  }

}
