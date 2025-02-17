import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessario per ngIf
import { FormsModule } from '@angular/forms'; // Necessario per ngModel, ngForm

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa i moduli necessari
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  // Proprietà per il form
  username: string = '';
  email: string = '';
  proposal: string = '';
  feedbackMessage: string | null = null;

  // Metodo per gestire il submit
  onSubmit(): void {
    if (this.username && this.email && this.proposal) {
      this.feedbackMessage = 'Grazie per la tua proposta di miglioramento!';
      // Reset del form
      this.username = '';
      this.email = '';
      this.proposal = '';
    } else {
      this.feedbackMessage = 'Si prega di compilare tutti i campi.';
    }

    // Rimuove il messaggio di feedback dopo 5 secondi
    setTimeout(() => {
      this.feedbackMessage = null;
    }, 5000);
  }
}
