import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuizItem {
  id: number;
  title: string;
  description?: string;
}

/** Full quiz from GET /api/quizzes/{id} (extra fields depend on backend serialization). */
export interface QuizDetail extends QuizItem {
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  assignQuestionToQuiz(questionId: number, quizId: number, agentId: number): Observable<unknown> {
    const params = new HttpParams()
      .set('questionId', String(questionId))
      .set('quizId', String(quizId))
      .set('agentId', String(agentId));

    return this.http.post(`${this.apiBaseUrl}/api/quiz-assignments`, null, { params });
  }

  getAllQuizzes(): Observable<QuizItem[]> {
    return this.http.get<QuizItem[]>(`${this.apiBaseUrl}/api/quizzes`);
  }

  /** GET /api/quizzes/{id} */
  getQuiz(id: number): Observable<QuizDetail> {
    return this.http.get<QuizDetail>(`${this.apiBaseUrl}/api/quizzes/${id}`);
  }

  /**
   * POST /api/quizzes
   * Query: title, description, createdById
   */
  createQuiz(title: string, description: string, createdById: number): Observable<QuizDetail> {
    const params = new HttpParams()
      .set('title', title)
      .set('description', description)
      .set('createdById', String(createdById));
    return this.http.post<QuizDetail>(`${this.apiBaseUrl}/api/quizzes`, null, { params });
  }
}

