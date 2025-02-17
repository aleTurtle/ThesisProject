import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-problem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-problem">
      <h2>Segnala un problema</h2>
      <form (ngSubmit)="submitProblem()">
        <label for="problem-description">Descrizione del problema</label>
        <textarea
          id="problem-description"
          [(ngModel)]="problemDescription"
          name="problemDescription"
          rows="5"
          placeholder="Descrivi il problema..."
          required
        ></textarea>
        <button type="submit">Invia</button>
      </form>
      <p *ngIf="submissionSuccess">{{ feedbackMessage }}</p>
    </div>
  `,
  styleUrls: ['./report-problem.component.scss'],
})
export class ReportProblemComponent {
  problemDescription: string = '';
  submissionSuccess: boolean = false;
  feedbackMessage: string = '';

  submitProblem() {
    if (this.problemDescription.trim()) {
      // Qui si può integrare il servizio per inviare il problema a un server
      console.log('Problema inviato:', this.problemDescription);
      this.submissionSuccess = true;
      this.feedbackMessage = 'Grazie per la tua segnalazione! Stiamo analizzando il problema.';
      this.problemDescription = '';

      // Reset del messaggio di feedback dopo 5 secondi
      setTimeout(() => (this.submissionSuccess = false), 5000);
    }
  }
}
