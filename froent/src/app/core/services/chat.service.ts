import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface ApiChatUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
}

export interface ApiChatMessage {
  id: number;
  sender: ApiChatUser;
  receiver: ApiChatUser;
  message: string;
  timestamp: string;
  seen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiBaseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  sendMessage(senderId: number, receiverId: number, message: string): Observable<ApiChatMessage> {
    const params = new HttpParams()
      .set('senderId', String(senderId))
      .set('receiverId', String(receiverId))
      .set('message', message);

    return this.http.post<ApiChatMessage>(`${this.apiBaseUrl}/api/chat`, null, { params });
  }

  getUnreadMessages(userId: number): Observable<ApiChatMessage[]> {
    return this.http.get<ApiChatMessage[]>(`${this.apiBaseUrl}/api/chat/unread/${userId}`);
  }

  /**
   * Backend conversation endpoint is directional (sender->receiver).
   * To show a full chat thread, we fetch both directions and merge/sort by timestamp.
   */
  loadConversation(userId: number, peerUserId: number): Observable<ApiChatMessage[]> {
    const params1 = {
      user1Id: userId,
      user2Id: peerUserId
    };
    const params2 = {
      user1Id: peerUserId,
      user2Id: userId
    };

    return forkJoin([
      this.http.get<ApiChatMessage[]>(`${this.apiBaseUrl}/api/chat/conversation`, { params: params1 }),
      this.http.get<ApiChatMessage[]>(`${this.apiBaseUrl}/api/chat/conversation`, { params: params2 })
    ]).pipe(
      map(([a, b]) => [...a, ...b].sort((m1, m2) => new Date(m1.timestamp).getTime() - new Date(m2.timestamp).getTime()))
    );
  }

  markAsSeen(chatMessageId: number): Observable<ApiChatMessage> {
    return this.http.put<ApiChatMessage>(`${this.apiBaseUrl}/api/chat/${chatMessageId}/seen`, {});
  }
}

