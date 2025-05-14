import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  defaultUserInfos,
  MessageModel,
  UserInfoModel,
} from './dataExample';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat-inner',
  templateUrl: './chat-inner.component.html',
})
export class ChatInnerComponent implements OnInit {
  @Input() isDrawer: boolean = false;
  @HostBinding('class') class = 'card-body';
  @HostBinding('id') id = this.isDrawer
    ? 'kt_drawer_chat_messenger_body'
    : 'kt_chat_messenger_body';

  @ViewChild('messageInput', { static: true })
  messageInput!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  private messages$: BehaviorSubject<Array<MessageModel>> = new BehaviorSubject<
    Array<MessageModel>
  >([]);
  messagesObs: Observable<Array<MessageModel>>;

  constructor(private http: HttpClient) {
    this.messagesObs = this.messages$.asObservable();
  }

  ngOnInit(): void {}

  submitMessage(): void {
    const text = this.messageInput.nativeElement.value.trim();
    if (!text) return;

    const newMessage: MessageModel = {
      user: 2,
      type: 'out',
      text,
      time: 'Just now',
    };
    this.addMessage(newMessage);
    this.messageInput.nativeElement.value = '';

    // Yazıyor animasyonu
    const typingIndicator: MessageModel = {
      user: 4,
      type: 'in',
      text: `
        <span style="display:inline-flex;gap:4px;font-size:20px;font-weight:bold;">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
        <style>
          .dot {
            animation: blink 1.4s infinite;
          }
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        </style>
      `,
      time: 'Typing...',
      template: true,
    };

    this.addMessage(typingIndicator);

    this.sendMessageToApi(text).subscribe({
      next: (res:any) => {
        this.removeTypingIndicator();

        const replyMessage: MessageModel = {
          user: 4,
          type: 'in',
          text: res.response,
          time: 'Just now',
        };
        this.addMessage(replyMessage);
      },
      error: () => {
        this.removeTypingIndicator();
        this.addMessage({
          user: 4,
          type: 'in',
          text: 'Bir hata oluştu 😓',
          time: 'Just now',
        });
      },
    });
  }

  onEnter(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
      return;
    }
    keyboardEvent.preventDefault();
    this.submitMessage();
  }

  addMessage(newMessage: MessageModel): void {
    const messages = [...this.messages$.value, newMessage];
    this.messages$.next(messages);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  removeTypingIndicator(): void {
    const filteredMessages = this.messages$.value.filter((m) => !m.template);
    this.messages$.next(filteredMessages);
  }

  scrollToBottom(): void {
    try {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.warn('Scroll anchor error:', e);
    }
  }

  getUser(user: number): UserInfoModel {
    return defaultUserInfos[user];
  }

  getMessageCssClass(message: MessageModel): string {
    return `p-5 rounded text-dark fw-bold mw-lg-400px bg-light-${message.type === 'in' ? 'info' : 'primary'
      } text-${message.type === 'in' ? 'start' : 'end'}`;
  }

  sendMessageToApi(message: string): Observable<{ response: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'skipInterceptor': 'true','noloading': 'true' });
    // JSON string formatında query oluştur
    const query = JSON.stringify( message );

    const body = { query };
    return this.http.post<{ response: string }>("http://10.20.24.36:80/ask", body, { headers });
  }
}
