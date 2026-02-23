import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
})
export class StudentComponent {
  student = {
    name: 'Mohamed Dhia Sakkar',
    headline: ' Machine Learning student',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    pays: 'france | italie | spain',
    age: 22,
    email: 'your.email@example.com',
    phoneNumber: '+1234567890',
    chosenCountry: 'Canada',
    countryFlagUrl: 'https://flagcdn.com/ca.svg',
    cvUrl: '#',
    socialLinks: [
      { name: 'GitHub', url: '#' },
      { name: 'LinkedIn', url: '#' }
    ],
    openToWork: ['Software Engineer', 'Full-Stack Developer', 'Machine Learning'],
    skills: ['Angular', 'TypeScript', 'Python', 'Java', 'Machine Learning'],
    education: [
      { degree: 'Baccalauréat Mathématiques', institution: 'Lycée Pilote', year: '2020' },
      { degree: 'Génie Logiciel', institution: 'ESPRIT', year: '2024' }
    ],
    documents: [
      { name: 'Diplome_Bac.pdf', type: 'pdf', size: '1.2MB', url: '#' },
      { name: 'Releve_notes.pdf', type: 'pdf', size: '800KB', url: '#' },
      { name: 'Passport_Scan.jpg', type: 'image', size: '2.5MB', url: '#' }
    ]
  };

  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      alert(`Message envoyé : "${this.newMessage}"`);
      this.newMessage = '';
    }
  }
}
