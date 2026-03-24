import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Matches backend `StudentQuizController` body item `StudentAnswerDTO`.
 */
export interface StudentAnswerDTO {
  questionId: number;
  /** One of "A", "B", "C", "D" (MCQ). */
  selectedOption: string;
}

export interface StudentQuizQuestion {
  id: number;
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
}

/** Matches backend `ResponseEntity.ok(Map.of("quizAttemptId", ..., "message", ...))`. */
export interface SubmitQuizResponse {
  quizAttemptId: number;
  message: string;
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

  /**
   * POST /api/student-quiz/submit
   * Query: studentId, quizId — body: StudentAnswerDTO[]
   */
  submitQuiz(
    studentId: number,
    quizId: number,
    answers: StudentAnswerDTO[]
  ): Observable<SubmitQuizResponse> {
    const params = new HttpParams()
      .set('studentId', String(studentId))
      .set('quizId', String(quizId));

    return this.http.post<SubmitQuizResponse>(
      `${this.apiBaseUrl}/api/student-quiz/submit`,
      answers,
      { params }
    );
  }
}
