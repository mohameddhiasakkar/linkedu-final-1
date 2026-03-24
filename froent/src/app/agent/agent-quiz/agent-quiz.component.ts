import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { QuizItem, QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-agent-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-quiz.component.html',
  styleUrls: ['./agent-quiz.component.css']
})
export class AgentQuizComponent implements OnInit {
  quizzes: QuizItem[] = [];

  selectedQuizId: number | null = null;
  questionId: number | null = null;

  newQuizTitle = '';
  newQuizDescription = '';

  isLoading = false;
  isSubmitting = false;
  isCreatingQuiz = false;
  message = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.quizService.getAllQuizzes().subscribe({
      next: (items) => {
        this.quizzes = items;
        this.selectedQuizId = items[0]?.id ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load quizzes.';
        this.isLoading = false;
      }
    });
  }

  createQuiz(): void {
    const rawId = this.authService.getUserId();
    const createdById = rawId ? Number(rawId) : NaN;
    const title = this.newQuizTitle.trim();
    const description = this.newQuizDescription.trim();

    if (!Number.isFinite(createdById)) {
      this.errorMessage = 'User id not found in session.';
      return;
    }
    if (!title) {
      this.errorMessage = 'Quiz title is required.';
      return;
    }

    this.isCreatingQuiz = true;
    this.message = '';
    this.errorMessage = '';

    this.quizService.createQuiz(title, description || ' ', createdById).subscribe({
      next: (quiz) => {
        this.quizzes = [...this.quizzes, { id: quiz.id, title: quiz.title, description: quiz.description }];
        this.selectedQuizId = quiz.id;
        this.newQuizTitle = '';
        this.newQuizDescription = '';
        this.message = `Created quiz #${quiz.id}: ${quiz.title}`;
        this.isCreatingQuiz = false;
      },
      error: () => {
        this.errorMessage = 'Failed to create quiz.';
        this.isCreatingQuiz = false;
      }
    });
  }

  assign(): void {
    const rawAgentId = this.authService.getUserId();
    const agentId = rawAgentId ? Number(rawAgentId) : NaN;

    if (!Number.isFinite(agentId)) {
      this.errorMessage = 'Agent id not found in session.';
      return;
    }
    if (!this.selectedQuizId || !this.questionId) {
      this.errorMessage = 'Please fill quiz and question ids.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.errorMessage = '';

    this.quizService.assignQuestionToQuiz(this.questionId, this.selectedQuizId, agentId).subscribe({
      next: () => {
        this.message = `Question #${this.questionId} assigned to quiz #${this.selectedQuizId}.`;
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Assignment failed. Check question id / quiz id.';
        this.isSubmitting = false;
      }
    });
  }
}

