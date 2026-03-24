import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  sidebarCollapsed = false;
  currentSection = 'statistics';

  stats = {
    employers: 156,
    students: 2847,
    activeJobs: 89,
    revenue: 456800
  };

  students = [
    { id: 1, name: 'Ahmed Ben Ali', email: 'ahmed@email.com', university: 'ENSI', status: 'active', applications: 5 },
    { id: 2, name: 'Marie Dupont', email: 'marie@email.com', university: 'MIT', status: 'active', applications: 3 },
    { id: 3, name: 'Karim Trabelsi', email: 'karim@email.com', university: 'FST', status: 'pending', applications: 2 },
    { id: 4, name: 'Sophie Martin', email: 'sophie@email.com', university: 'Harvard', status: 'active', applications: 8 },
    { id: 5, name: 'Ali Ben Ammar', email: 'ali@email.com', university: 'INSAT', status: 'inactive', applications: 0 }
  ];

  employers = [
    { id: 1, name: 'TechCorp Tunisia', industry: 'Technology', jobs: 12, status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Global Services', industry: 'Consulting', jobs: 8, status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'StartupHub', industry: 'Startup', jobs: 5, status: 'pending', joined: '2024-03-10' },
    { id: 4, name: 'FinancePlus', industry: 'Finance', jobs: 15, status: 'active', joined: '2023-11-05' },
    { id: 5, name: 'HealthCare TN', industry: 'Healthcare', jobs: 6, status: 'active', joined: '2024-01-28' }
  ];

  financeData = [
    { month: 'Jan', income: 45000, expenses: 28000 },
    { month: 'Feb', income: 52000, expenses: 31000 },
    { month: 'Mar', income: 48000, expenses: 29000 },
    { month: 'Apr', income: 61000, expenses: 34000 },
    { month: 'May', income: 55000, expenses: 32000 },
    { month: 'Jun', income: 67000, expenses: 38000 }
  ];

  recentTransactions = [
    { id: 1, type: 'subscription', company: 'TechCorp Tunisia', amount: 500, date: '2026-02-07', status: 'completed' },
    { id: 2, type: 'premium', company: 'Marie Dupont', amount: 49, date: '2026-02-06', status: 'completed' },
    { id: 3, type: 'refund', company: 'Ali Ben Ammar', amount: 25, date: '2026-02-05', status: 'pending' },
    { id: 4, type: 'subscription', company: 'Global Services', amount: 750, date: '2026-02-04', status: 'completed' },
    { id: 5, type: 'premium', company: 'Sophie Martin', amount: 49, date: '2026-02-03', status: 'completed' }
  ];

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setSection(section: string) {
    this.currentSection = section;
  }

  getStatusClass(status: string): string {
    return status;
  }
}
