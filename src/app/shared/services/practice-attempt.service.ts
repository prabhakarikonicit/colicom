import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AttemptSave, PracticeAttemptResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeAttemptService {

  constructor(private http:HttpService) { }
  save(attempt: AttemptSave) {
    // Todo: check for logic again
    return this.http.postData<PracticeAttemptResponse>(`/module-attempts`, attempt)
      .pipe(map((practiceAttempts: PracticeAttemptResponse) => {
        return practiceAttempts.item;
      }));
  }
}
