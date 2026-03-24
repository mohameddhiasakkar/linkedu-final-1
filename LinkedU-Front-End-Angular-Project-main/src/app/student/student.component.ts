import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student, Document, Message } from './student.model';
import { ChatComponent } from '../components/chat/chat.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentProfileComponent implements OnInit {

  student: Student = {
    name: 'Dhia Eddine Bouhouch',
    headline: 'Computer Science Student | Full Stack Developer',
    profilePicture: 'assets/images/default-avatar.png',
    countryFlagUrl: 'assets/pics/c1.jpg',
    chosenCountry: 'France',
    timezone: 'GMT+1',
    email: 'dhia.bouhouch@example.com',
    phoneNumber: '+216 12 345 678',
    location: 'Tunis, Tunisia',
    pays: 'France | Canada | Germany | Switzerland',
    skills: ['Angular', 'React', 'Node.js', 'Python'],
    education: [],
    experience: [],
    documents: [],
    socialLinks: [],
    cvUrl: '/documents/Dhia_Bouhouch_CV.pdf',
    connections: 156,
    availability: 'Available for opportunities',
    completionRate: '92%'
  };

  newMessage: string = '';
  messages: Message[] = [];

  ngOnInit(): void {
    console.log('Student Profile Loaded ✅');
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        sender: 'Dhia Eddine',
        senderInitials: 'D',
        content: this.newMessage,
        timestamp: new Date(),
        isOwn: true
      });
      this.newMessage = '';
    }
  }

  downloadDocument(doc: Document): void {
    window.open(doc.url, '_blank');
  }

}
@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {}
