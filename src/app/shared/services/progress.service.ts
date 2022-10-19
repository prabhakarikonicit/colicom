import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Progress, ProgressesResponse } from '../interfaces/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private http: HttpService) { }

  query(enrollmentId: number) {
    return this.http.getData<ProgressesResponse>(`/enrollments/${enrollmentId}/progresses`)
     .pipe(map((progresses: ProgressesResponse) => {
        return progresses.items;
      }));
  }

  bulkUpdate(enrollmentId: number, progressesToUpdate: Progress) {
    return this.http.putData(`/enrollments/${enrollmentId}/progresses`, progressesToUpdate)
    .pipe(map((progressQuestions: any) => {
      return progressQuestions;
    }));
  }

  update(enrollmentId: number, progressesToUpdate: Progress) {
    return this.http.putData(`/enrollments/${enrollmentId}/progresses/${progressesToUpdate.id}`, progressesToUpdate)
    .pipe(map((progressQuestions: any) => {
      return progressQuestions;
    }));
  }

  recalculate(enrollmentId: number, id: number) {
    return this.http.postData(`/enrollments/${enrollmentId}/progresses/${id}/recalculate`, {})
    .pipe(map((progressQuestions: any) => {
      return progressQuestions;
    }));
  }

}
