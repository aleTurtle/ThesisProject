import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule per ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  user = { username: '', password: '', role: '' }; // Oggetto user inizializzato

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    try {
      // Verifica che i campi obbligatori siano presenti
      if (!this.user.username || !this.user.password || !this.user.role) {
        alert('Tutti i campi sono obbligatori!');
        return;
      }
  
      // Chiama il servizio di registrazione
      this.authService.signUp(this.user.username, this.user.password, this.user.role).subscribe(
        (response) => {
          // Gestisci la risposta del servizio
          alert('Registrazione riuscita!');
          this.router.navigate(['/login']); // Redirige al login
        },
        
      );
    } catch (error)  {
      // Gestisci eventuali errori inattesi
    console.error('Errore inatteso durante la registrazione:', error);
    alert('Si è verificato un errore inatteso. Riprova più tardi.');
    }
  }
  
    

}
