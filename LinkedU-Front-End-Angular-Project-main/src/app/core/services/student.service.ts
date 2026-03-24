import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfileResponse } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  getMyStudents(): Observable<StudentProfileResponse[]> {
    return this.http.get<StudentProfileResponse[]>(`${this.apiBaseUrl}/api/students/my-students`);
  }
}

