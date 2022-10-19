import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { GlobalService } from '../services/global.service';

@Pipe({
  name: 'glossaryTerms'
})
export class GlossaryTermsPipe implements PipeTransform {


  constructor(private globalService: GlobalService) {

  }

  transform(input: string, glossaryTerms: unknown[]): unknown {
    let safeHtmlInput: string | null;

    if (input) {
      safeHtmlInput = this.globalService.trustAsHtml(input);

      glossaryTerms.forEach((glossaryTerm: any) => {

        // pattern not right yet, if the vocab is the last word in the sentence not followed by another space or character then
        // it doesn't get highlighted.
        const regEx = new RegExp("\\b(" + glossaryTerm.questionText + ")((?![^<]*>|[^<>]*</)|" + glossaryTerm.questionText + "$) ", 'gi');
        const definition = glossaryTerm.answers[0].answerText;

        // do we have a match before we try it?
        if (regEx.test(input)) {
          input = input.replace(regEx, '<span class="vocab_word ttip" data-tooltip="' + definition + '">$1</span> ');
        }

      });

      // input = $sce.trustAsHtml(input);

      return safeHtmlInput;
    }
    return null;
  }

}
