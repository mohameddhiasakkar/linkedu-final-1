import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ApiChatMessage, ApiChatUser, ChatService } from '../../core/services/chat.service';

type PeerOption = {
  id: number;
  label: string;
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * When provided, the component uses this peer id directly and hides the peer picker.
   * Example: agent chat where the peer is a selected student.
   */
  @Input() peerUserId: number | null = null;

  @ViewChild('endOfMessages') endOfMessages?: ElementRef<HTMLDivElement>;

  currentUserId: number | null = null;

  peerOptions: PeerOption[] = [];
  selectedPeerId: number | null = null;

  draftMessage = '';
  messages: ApiChatMessage[] = [];

  manualPeerId: number | null = null;

  isLoading = false;
  private subs = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    const rawUserId = this.authService.getUserId();
    const parsed = rawUserId ? Number(rawUserId) : NaN;
    this.currentUserId = Number.isFinite(parsed) ? parsed : null;

    if (!this.currentUserId) return;

    if (this.peerUserId != null) {
      this.selectedPeerId = this.peerUserId;
      this.loadConversation();
      return;
    }

    this.refreshPeersFromUnread();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('peerUserId' in changes && this.currentUserId) {
      const next = changes['peerUserId'].currentValue as number | null;
      if (next != null) {
        this.selectedPeerId = next;
        this.loadConversation();
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private userLabel(user: ApiChatUser | null | undefined): string {
    if (!user) return 'Unknown user';
    const first = user.firstName?.trim();
    const last = user.lastName?.trim();
    const full = [first, last].filter(Boolean).join(' ');
    return full || (user.username ? user.username : `User #${user.id}`);
  }

  private refreshPeersFromUnread(): void {
    if (!this.currentUserId) return;

    this.subs.add(
      this.chatService.getUnreadMessages(this.currentUserId).subscribe({
        next: (unread) => {
          const mapById = new Map<number, PeerOption>();
          for (const m of unread) {
            const sender = m.sender;
            if (!sender?.id) continue;
            if (!mapById.has(sender.id)) {
              mapById.set(sender.id, { id: sender.id, label: this.userLabel(sender) });
            }
          }

          this.peerOptions = Array.from(mapById.values());
          this.selectedPeerId = this.peerOptions[0]?.id ?? null;
          if (this.selectedPeerId != null) this.loadConversation();
        },
        error: () => {
          // If unread endpoint fails, peer picker stays empty; user can still manually enter a peer id.
          this.peerOptions = [];
        }
      })
    );
  }

  selectPeer(peerId: number): void {
    this.selectedPeerId = peerId;
    this.loadConversation();
  }

  manualSelectPeer(): void {
    if (this.manualPeerId == null) return;
    this.selectPeer(this.manualPeerId);
  }

  private loadConversation(): void {
    if (!this.currentUserId || this.selectedPeerId == null) return;

    this.isLoading = true;
    this.subs.add(
      this.chatService.loadConversation(this.currentUserId, this.selectedPeerId).subscribe({
        next: (msgs) => {
          this.messages = msgs;
          this.isLoading = false;
          this.markIncomingAsSeen();
          setTimeout(() => this.endOfMessages?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 0);
        },
        error: () => {
          this.messages = [];
          this.isLoading = false;
        }
      })
    );
  }

  private markIncomingAsSeen(): void {
    if (!this.currentUserId) return;

    const toMark = this.messages.filter(m => m.receiver?.id === this.currentUserId && !m.seen);
    if (toMark.length === 0) return;

    this.subs.add(
      forkJoin(toMark.map(m => this.chatService.markAsSeen(m.id))).subscribe({
        next: () => {
          // Optimistically mark locally; avoids another full reload.
          for (const m of this.messages) {
            if (m.receiver?.id === this.currentUserId && !m.seen) m.seen = true;
          }
        },
        error: () => {
          // Non-fatal; the user will see "unseen" again after refresh.
        }
      })
    );
  }

  send(): void {
    if (!this.currentUserId || this.selectedPeerId == null) return;

    const content = this.draftMessage.trim();
    if (!content) return;

    const senderId = this.currentUserId;
    const receiverId = this.selectedPeerId;

    this.subs.add(
      this.chatService.sendMessage(senderId, receiverId, content).subscribe({
        next: () => {
          this.draftMessage = '';
          this.loadConversation();
        },
        error: () => {
          // Keep draft so the user can retry.
        }
      })
    );
  }
}

