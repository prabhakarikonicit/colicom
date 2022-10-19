import { Injectable } from '@angular/core';
import { AssessmentAttemptsResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleQuestionService {

  constructor(private http : HttpService) { }

  queryForModuleWithAnswers(moduleId: number, type:string) {
    return this.http.getData<AssessmentAttemptsResponse>(`/modules/${moduleId}/types/${type}/questions?includes[]=answers`)
    .pipe(map((moduleWithAnswers: AssessmentAttemptsResponse) => {
      return moduleWithAnswers.items;
    }));
  }

}
