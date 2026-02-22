import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class TicketComponent {
  // Simulated user access - in a real app, this would come from authentication service
  hasAccess = true;

  // Ticket data
  ticket = {
    id: 'TKT-2026-001',
    meetingTitle: 'LinkedU Career Counseling Session',
    meetingDate: 'February 15, 2026',
    meetingTime: '10:00 AM - 11:00 AM (UTC+1)',
    googleMeetLink: 'https://meet.google.com/abc-defg-hij',
      host: 'Tasnime Chouikh',
    description: 'One-on-one career counseling session to discuss your professional goals and internship opportunities.'
  };

  // Copy link to clipboard
  copyLink(): void {
    navigator.clipboard.writeText(this.ticket.googleMeetLink).then(() => {
      alert('Meeting link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.ticket.googleMeetLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Meeting link copied to clipboard!');
    });
  }

  // Open Google Meet in new tab
  joinMeeting(): void {
    window.open(this.ticket.googleMeetLink, '_blank');
  }
}
