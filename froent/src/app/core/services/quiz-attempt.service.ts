import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Matches backend `QuizAttempt` JSON shape (nested entities may be minimal). */
export interface QuizAttemptItem {
  id: number;
  score?: number | null;
  completedAt?: string;
  quiz?: {
    id: number;
    title?: string;
  };
  student?: {
    id: number;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  /**
   * POST /api/quiz-attempts
   * Query: studentId, quizId, score
   */
  submitAttempt(studentId: number, quizId: number, score: number): Observable<QuizAttemptItem> {
    const params = new HttpParams()
      .set('studentId', String(studentId))
      .set('quizId', String(quizId))
      .set('score', String(score));

    return this.http.post<QuizAttemptItem>(`${this.apiBaseUrl}/api/quiz-attempts`, null, { params });
  }

  /** GET /api/quiz-attempts/student/{studentId} */
  getStudentAttempts(studentId: number): Observable<QuizAttemptItem[]> {
    return this.http.get<QuizAttemptItem[]>(
      `${this.apiBaseUrl}/api/quiz-attempts/student/${studentId}`
    );
  }
}
