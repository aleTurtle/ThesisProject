import { Routes } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { HomeComponent } from './components/home/home.component'; // Importa il componente Home
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserAuthenticatedComponent } from './components/user-authenticated/user-authenticated.component';
import { SupportComponent } from './components/support/support.component';
import { ReportProblemComponent } from './components/report-problem/report-problem.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page

  { path: 'report-problem', component: ReportProblemComponent }, // pagina per inviare segnalazioni o richieste non ben gestite

  {path:'support',component: SupportComponent}, //pagina dedicata allo sviluppo del progetto

  {path: 'user' , component: UserAuthenticatedComponent}, //pagina dell'utente autenticato

  { path: 'sign-up', component: SignupComponent}, // pagina per la registrazione

  { path: 'login', component: LoginComponent}, // pagina di login 

 // { path: 'chatbot', component: ChatbotComponent }, // Chatbot page

  { path: 'about', component: AboutComponent}, //pagina dedicata a spiegare il progetto e rispondere alle FAQ

// Route di fallback,cattura tutte le richieste non corrispondenti a quelle definite e reindirizza alla home 
  { path: '**', redirectTo: '' }, 
];
