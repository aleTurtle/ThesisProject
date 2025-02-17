import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import del servizio AuthService
import { Router } from '@angular/router'; // Import di Router per la navigazione
import { User } from '../../models/User'; // Import dell'interfaccia User
import { FormsModule } from '@angular/forms';
//import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: User = { username: '', password: '', role: '' }; // Oggetto user inizializzato

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    //controlla che tutti i campi siano inseriti 
    if(!this.user.username || !this.user.password){
      alert('Tutti i campi sono obbligatori!');
      return;
    }

    

    // Chiamata al servizio di autenticazione per effettuare il login
    this.authService.login(this.user.username, this.user.password).subscribe(
      

      (response) => {
        console.log('Risposta del server:', response);

         // Verifica che la risposta contenga un token
      if (!response.token || typeof response.token !== 'string') {
        alert('Errore: il token non è valido o è mancante nella risposta del server.');
        return;
      }
        // Salviamo il token ricevuto dalla risposta del login
        this.authService.setToken(response.token);

        // Verifica che l'oggetto utente sia presente e contenga un username
      if (!response.user || !response.user.username) {
        alert('Errore: dati dell\'utente mancanti o non validi.');
        return;
      }

        // Salviamo l'utente autenticato
        const authenticatedUser: User = response.user; // Presupponiamo che la risposta contenga un oggetto `user`
        this.authService.setAuthenticatedUser(authenticatedUser);


        // Reindirizziamo l'utente alla rotta della chat
        this.router.navigate(['/user']);  
      },
      (error) => {
      // Gestiamo gli errori
      if (error.status === 404 && error.error.message === 'Utente non trovato') {
        alert('L\'utente non esiste. Verifica il nome utente e riprova.');
      } else if (error.status === 400) {
        alert('Credenziali errate. Riprova.');
      } else {
        alert('Errore di login: ' + error.message);
      }
    }
    );
  }
}