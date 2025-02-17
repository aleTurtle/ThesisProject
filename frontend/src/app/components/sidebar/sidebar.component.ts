import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar" [ngClass]="{ 'open': sidebarOpen }">
      <div class="sidebar-content">
        <!-- User Profile Section -->
        <div class="user-profile">
          <h3>Profilo Utente</h3>
          <div class="profile-info">
            <div class="profile-icon" (click)="toggleProfile()">{{ userIcon }}</div>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="settings">
          <h3>Impostazioni</h3>
          <ul>
            <li (click)="navigateToSettings()">Modifica Profilo</li>
            <li (click)="navigateToProblem()">Segnala problema</li>
            <li (click)="navigateToPreferences()">Preferenze</li>
          </ul>
        </div>

        <!-- Conversation Section -->
        <h3>Conversazioni</h3>
        <ul>
          <li
            *ngFor="let conversation of conversations"
            [class.active]="conversation.id === activeConversationId"
            (click)="switchConversation(conversation.id)"
          >
            {{ conversation.name }}
            <button
              class="close-conversation"
              (click)="closeConversation(conversation.id); $event.stopPropagation()"
            >
              ✖
            </button>
          </li>
        </ul>
        <button class="new-conversation" (click)="startNewConversation()">
          <span class="conversation icon">➕</span> Nuova Conversazione
        </button>
      </div>
    </div>

    <!-- Modal Profilo -->
    <div class="user-profile-modal" *ngIf="showProfile">
      <div class="profile-header">
        Profilo Utente
        <button class="close-profile" (click)="toggleProfile()">✖</button>
      </div>
      <div class="profile-content">
        <div class="profile-icon">{{ userIcon }}</div>
        <p><strong>Nome utente</strong>: {{ username }}</p>
        <p><strong>Ruolo:</strong> {{ role }}</p>
      </div>
    </div>
    <button class="sidebar-toggle-button" (click)="toggleSidebar()">☰</button>
  `,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() username: string | null = null;
  @Input() role: string | null = null;
  @Input() userIcon: string = '';
  @Input() conversations: Array<{ id: number; name: string; messages: Array<{ user: boolean; text: string }> }> = [];
  @Input() activeConversationId: number | null = null;

  @Output() conversationSwitched = new EventEmitter<number>();
  @Output() newConversationStarted = new EventEmitter<void>();

  sidebarOpen = false;
  showProfile = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  startNewConversation() {
    this.newConversationStarted.emit();
  }

  switchConversation(conversationId: number) {
    this.conversationSwitched.emit(conversationId);
  }

  closeConversation(conversationId: number) {
    this.conversations = this.conversations.filter((c) => c.id !== conversationId);
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = this.conversations.length > 0 ? this.conversations[0].id : null;
      this.conversationSwitched.emit(this.activeConversationId || 0);
    }
  }

  navigateToSettings() {
    console.log('Navigazione alla sezione Impostazioni.');
  }

  navigateToPreferences() {
    console.log('Navigazione alla sezione Preferenze.');
  }

  navigateToProblem() {
    this.router.navigate(['/report-problem']);
  }
}
