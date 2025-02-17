import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; //importa i moduli necessari per i componenti standalone
import { RouterModule } from '@angular/router'; //importa i moduli per permettere il routing al componente

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
