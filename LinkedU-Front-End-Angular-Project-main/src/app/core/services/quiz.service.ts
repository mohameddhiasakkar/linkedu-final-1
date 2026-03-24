import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuizItem {
  id: number;
  title: string;
  description?: string;
}

export interface QuizQuestionItem {
  id: number;
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
}

export interface StudentAnswerPayload {
  questionId: number;
  selectedOption: string;
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

  getQuizQuestions(quizId: number): Observable<QuizQuestionItem[]> {
    return this.http.get<QuizQuestionItem[]>(`${this.apiBaseUrl}/api/student-quiz/quiz/${quizId}/questions`);
  }

  submitQuiz(studentId: number, quizId: number, answers: StudentAnswerPayload[]): Observable<{ message: string; quizAttemptId: number }> {
    const params = new HttpParams()
      .set('studentId', String(studentId))
      .set('quizId', String(quizId));

    return this.http.post<{ message: string; quizAttemptId: number }>(
      `${this.apiBaseUrl}/api/student-quiz/submit`,
      answers,
      { params }
    );
  }
}

