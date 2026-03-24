import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../../components/chat/chat.component';
import { StudentService } from '../../core/services/student.service';
import { StudentProfileResponse } from '../../shared/models/models';

@Component({
  selector: 'app-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './agent-chat.component.html',
  styleUrls: ['./agent-chat.component.css']
})
export class AgentChatComponent implements OnInit {
  myStudents: StudentProfileResponse[] = [];
  selectedPeerUserId: number | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(private readonly studentService: StudentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getMyStudents().subscribe({
      next: (students) => {
        this.myStudents = students;
        this.selectedPeerUserId = students[0]?.user?.id ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load students for this agent.';
        this.isLoading = false;
      }
    });
  }

  studentLabel(s: StudentProfileResponse): string {
    const user = s.user;
    if (!user) return `Student #${s.id}`;
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || `User #${user.id}`;
  }
}

