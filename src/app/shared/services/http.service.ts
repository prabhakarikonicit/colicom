import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getData<T>(url: string): Observable<T> {
    return this.http.get<T>(`${environment.API_BASE_PATH}${url}`);
  }

  postData<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.API_BASE_PATH}${url}`, body);
  }

  putData<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.API_BASE_PATH}${url}`, body);
  }

}
