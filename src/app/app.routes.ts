import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DestinationsComponent } from './destinations.component';
import { ServicesComponent } from './services.component';
import { BlogsComponent } from './blogs.component';
import { AboutUsComponent } from './about-us.component';
import { AdminComponent } from './admin.component';
import { TicketComponent } from './ticket.component';
import { StudentComponent } from './student.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'destinations', component: DestinationsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'ticket', component: TicketComponent },
  { path: 'student', component: StudentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
