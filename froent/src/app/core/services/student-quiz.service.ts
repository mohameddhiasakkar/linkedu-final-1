import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentQuizQuestion {
  id: number;
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  /** If present in API JSON, used to compute score for POST /api/quiz-attempts. */
  correctOption?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentQuizService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  /** GET /api/student-quiz/quiz/{quizId}/questions */
  getQuizQuestions(quizId: number): Observable<StudentQuizQuestion[]> {
    return this.http.get<StudentQuizQuestion[]>(
      `${this.apiBaseUrl}/api/student-quiz/quiz/${quizId}/questions`
    );
  }

}
