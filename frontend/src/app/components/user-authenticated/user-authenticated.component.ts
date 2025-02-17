import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { ChatbotComponent} from '../chatbot/chatbot.component';


@Component({
  selector: 'app-user-authenticated',
  standalone: true,
  templateUrl: './user-authenticated.component.html',
  styleUrls: ['./user-authenticated.component.scss'],
  imports: [ChatbotComponent],
})
export class UserAuthenticatedComponent implements AfterViewInit {
  user: User | null = null;
  userMessages: string[] = []; // Lista per memorizzare i messaggi dell'utente
 


  @ViewChild(ChatbotComponent) chatbotComponent!: ChatbotComponent;
 

  constructor(private authService: AuthService, private router: Router) {
    try {
      this.user = this.authService.getAuthenticatedUser();
      if (!this.user) {
        console.log('Nessun utente autenticato trovato. Reindirizzamento a login.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'utente autenticato:', error);
    }
  }

  //aggiorna alcune proprietà del componente figlio con i dati dell'utente autenticato
  ngAfterViewInit() {
    if (this.chatbotComponent && this.user) {
      this.chatbotComponent.setWelcomeMessage(this.user.username);
      this.chatbotComponent.userIcon = this.user.username.charAt(0).toUpperCase(); 
      this.chatbotComponent.username = this.user.username;
      this.chatbotComponent.role = this.user.role;
      
    }
  }

   // Metodo per gestire i messaggi ricevuti dal ChatbotComponent
   handleMessageSent(message: string): void {
    console.log('Messaggio ricevuto:', message);
    this.userMessages.push(message); // Salva il messaggio nella lista
  }

  get username(): string | null {
    return this.user?.username || null;
  }

  get userIcon(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '';
  }

  logout(): void {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
