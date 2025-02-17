import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <app-sidebar
      [username]="username"
      [role]="role"
      [userIcon]="userIcon"
      [conversations]="conversations"
      [activeConversationId]="activeConversationId"
      (conversationSwitched)="handleConversationSwitched($event)"
      (newConversationStarted)="startNewConversation()"
    ></app-sidebar>

    <!-- Chat Window -->
    <div class="chat-window" [ngClass]="chatWindowClass">
      <div class="messages" #messagesContainer>
        <div *ngFor="let message of messages; let i = index" [ngClass]="{ 'message': true, 'justify-end': message.user, 'justify-start': !message.user }">
          <div [ngClass]="{ 'user': message.user, 'bot': !message.user }">
            <div *ngIf="!message.user" class="chatbot-icon">
              <img src="assets/images/unicam logo 3.png" alt="Chatbot Icon" />
            </div>
            <div class="message-text">
              <ng-container *ngIf="loadingIndex !== i; else loadingSpinner">
                {{ message.text }}
              </ng-container>
              <ng-template #loadingSpinner>
                <div class="spinner"></div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
      <div class="input-box">
        <textarea [(ngModel)]="userInput" placeholder="Scrivi un messaggio..." (keydown.enter)="sendMessage()" rows="1"></textarea>
        <button (click)="sendMessage()">
          <span class="send-icon">➤</span>
        </button>
        <button class="bottom-chat-button" (click)="scrollToBottom()">↓</button>
      </div>
    </div>
  `,
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @Input() username: string | null = null;
  @Input() role: string | null = null;
  @Input() userIcon: string = '';
  @Input() conversations: Array<{ id: number; name: string; messages: Array<{ user: boolean; text: string }> }> = [];
  @Input() activeConversationId: number | null = null;

  messages: Array<{ user: boolean; text: string }> = [];
  userInput = '';
  loading = false;
  loadingIndex: number | null = null;
  chatWindowClass = { reduced: false, centered: true };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadActiveConversation();
  }

  handleConversationSwitched(conversationId: number) {
    this.activeConversationId = conversationId;
    this.loadActiveConversation();
  }

  startNewConversation() {
    const newConversation = {
      id: this.conversations.length + 1,
      name: `Conversazione ${this.conversations.length + 1}`,
      messages: [{ user: false, text: `Benvenuto! Iniziamo una nuova conversazione.` }],
    };
    this.conversations.push(newConversation);
    this.activeConversationId = newConversation.id;
    this.messages = newConversation.messages;
  }

  loadActiveConversation() {
    const activeConversation = this.conversations.find((c) => c.id === this.activeConversationId);
    this.messages = activeConversation ? activeConversation.messages : [];
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ user: true, text: this.userInput });
      const botIndex = this.messages.length;
      this.messages.push({ user: false, text: '' });
      this.loadingIndex = botIndex;

      this.chatService.sendMessage(this.userInput).subscribe(
        (response) => {
          this.messages[botIndex] = { user: false, text: response.responses[0]?.text || 'Errore di risposta' };
          this.loadingIndex = null;
          this.scrollToBottom();
        },
        () => {
          this.messages[botIndex] = { user: false, text: 'Errore: il bot non è disponibile al momento.' };
          this.loadingIndex = null;
          this.scrollToBottom();
        }
      );
      this.userInput = '';
    }
  }
  setWelcomeMessage(username: string) {
    const welcomeMessage = `Benvenuto, ${username}! Come posso aiutarti oggi?`;
    this.messages[0] = { user: false, text: welcomeMessage };
    const currentConversation = this.conversations.find((c) => c.id === this.activeConversationId);
    if (currentConversation) {
      currentConversation.messages[0] = { user: false, text: welcomeMessage };
    }
  }
  scrollToBottom() {
    if (this.messagesContainer) {
      const nativeElement = this.messagesContainer.nativeElement;
      nativeElement.scrollTo({ top: nativeElement.scrollHeight, behavior: 'smooth' });
    }
  }
}
