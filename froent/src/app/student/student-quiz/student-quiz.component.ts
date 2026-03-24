import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { QuizAttemptItem, QuizAttemptService } from '../../core/services/quiz-attempt.service';
import { QuizDetail, QuizItem, QuizService } from '../../core/services/quiz.service';
import { StudentQuizService, StudentQuizQuestion } from '../../core/services/student-quiz.service';

@Component({
  selector: 'app-student-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-quiz.component.html',
  styleUrls: ['./student-quiz.component.css']
})
export class StudentQuizComponent implements OnInit {
  quizzes: QuizItem[] = [];
  selectedQuizId: number | null = null;
  quizDetail: QuizDetail | null = null;
  questions: StudentQuizQuestion[] = [];
  answersByQuestionId: Record<number, string> = {};

  attempts: QuizAttemptItem[] = [];

  isLoadingQuizzes = false;
  isLoadingQuestions = false;
  isLoadingAttempts = false;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(
    private readonly quizService: QuizService,
    private readonly studentQuizService: StudentQuizService,
    private readonly quizAttemptService: QuizAttemptService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoadingQuizzes = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (items) => {
        this.quizzes = items;
        this.selectedQuizId = items[0]?.id ?? null;
        this.isLoadingQuizzes = false;
        if (this.selectedQuizId) {
          this.loadQuizDetail();
          this.loadQuestions();
        }
        this.loadAttempts();
      },
      error: () => {
        this.errorMessage = 'Failed to load quizzes.';
        this.isLoadingQuizzes = false;
      }
    });
  }

  loadQuizDetail(): void {
    if (!this.selectedQuizId) {
      this.quizDetail = null;
      return;
    }
    this.quizService.getQuiz(this.selectedQuizId).subscribe({
      next: (q) => (this.quizDetail = q),
      error: () => (this.quizDetail = null)
    });
  }

  loadAttempts(): void {
    const rawStudentId = this.authService.getUserId();
    const studentId = rawStudentId ? Number(rawStudentId) : NaN;
    if (!Number.isFinite(studentId)) return;

    this.isLoadingAttempts = true;
    this.quizAttemptService.getStudentAttempts(studentId).subscribe({
      next: (rows) => {
        this.attempts = rows;
        this.isLoadingAttempts = false;
      },
      error: () => {
        this.attempts = [];
        this.isLoadingAttempts = false;
      }
    });
  }

  loadQuestions(): void {
    if (!this.selectedQuizId) return;

    this.loadQuizDetail();

    this.isLoadingQuestions = true;
    this.message = '';
    this.errorMessage = '';
    this.answersByQuestionId = {};

    this.studentQuizService.getQuizQuestions(this.selectedQuizId).subscribe({
      next: (qs) => {
        this.questions = qs;
        this.isLoadingQuestions = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load questions.';
        this.isLoadingQuestions = false;
      }
    });
  }

  /**
   * Score for POST /api/quiz-attempts: 0–100.
   * Uses `correctOption` when the API returns it; otherwise full credit if all questions are answered.
   */
  private computeScorePercent(): number {
    const total = this.questions.length;
    if (!total) return 0;

    let graded = 0;
    let correct = 0;

    for (const q of this.questions) {
      const selected = this.answersByQuestionId[q.id]?.trim();
      if (!selected) {
        throw new Error('Please answer every question.');
      }
      const expected = q.correctOption?.trim().toUpperCase();
      if (expected) {
        graded++;
        if (selected.toUpperCase() === expected) {
          correct++;
        }
      }
    }

    if (graded === 0) {
      return 100;
    }

    return (correct / graded) * 100;
  }

  submitQuiz(): void {
    const rawStudentId = this.authService.getUserId();
    const studentId = rawStudentId ? Number(rawStudentId) : NaN;
    if (!Number.isFinite(studentId) || !this.selectedQuizId) {
      this.errorMessage = 'Student session or quiz is missing.';
      return;
    }

    let score: number;
    try {
      score = this.computeScorePercent();
    } catch (e) {
      this.errorMessage = e instanceof Error ? e.message : 'Invalid answers.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.errorMessage = '';

    this.quizAttemptService.submitAttempt(studentId, this.selectedQuizId, score).subscribe({
      next: (attempt) => {
        this.message = `Submitted. Score: ${attempt.score ?? score}% (Attempt #${attempt.id})`;
        this.isSubmitting = false;
        this.loadAttempts();
      },
      error: () => {
        this.errorMessage = 'Submit failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  attemptQuizTitle(a: QuizAttemptItem): string {
    return a.quiz?.title ?? `Quiz #${a.quiz?.id ?? '?'}`;
  }
}
