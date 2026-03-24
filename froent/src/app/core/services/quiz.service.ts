import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuizItem {
  id: number;
  title: string;
  description?: string;
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
}

