import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { QuizItem, QuizQuestionItem, QuizService, StudentAnswerPayload } from '../../core/services/quiz.service';

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
  questions: QuizQuestionItem[] = [];
  answersByQuestionId: Record<number, string> = {};

  isLoadingQuizzes = false;
  isLoadingQuestions = false;
  isSubmitting = false;
  message = '';
  errorMessage = '';

  constructor(
    private readonly quizService: QuizService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoadingQuizzes = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (items) => {
        this.quizzes = items;
        this.selectedQuizId = items[0]?.id ?? null;
        this.isLoadingQuizzes = false;
        if (this.selectedQuizId) this.loadQuestions();
      },
      error: () => {
        this.errorMessage = 'Failed to load quizzes.';
        this.isLoadingQuizzes = false;
      }
    });
  }

  loadQuestions(): void {
    if (!this.selectedQuizId) return;

    this.isLoadingQuestions = true;
    this.message = '';
    this.errorMessage = '';
    this.answersByQuestionId = {};

    this.quizService.getQuizQuestions(this.selectedQuizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.isLoadingQuestions = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load questions.';
        this.isLoadingQuestions = false;
      }
    });
  }

  submitQuiz(): void {
    const rawStudentId = this.authService.getUserId();
    const studentId = rawStudentId ? Number(rawStudentId) : NaN;
    if (!Number.isFinite(studentId) || !this.selectedQuizId) {
      this.errorMessage = 'Student session or quiz is missing.';
      return;
    }

    const answers: StudentAnswerPayload[] = this.questions
      .filter((q) => !!this.answersByQuestionId[q.id])
      .map((q) => ({
        questionId: q.id,
        selectedOption: this.answersByQuestionId[q.id]
      }));

    if (answers.length === 0) {
      this.errorMessage = 'Please answer at least one question.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.errorMessage = '';

    this.quizService.submitQuiz(studentId, this.selectedQuizId, answers).subscribe({
      next: (res) => {
        this.message = `${res.message} (Attempt #${res.quizAttemptId})`;
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Submit failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}

