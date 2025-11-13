import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor(private globalService: GlobalService){}

  connect(user: any) {
    // connect only once
    if (!this.socket) {
      this.socket = io(this.globalService.baseUrl);

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.socket.emit('setup', user);
      });

      this.socket.on('connected', () => console.log('🟢 Socket setup complete'));
    }
  }

  joinChat(chatId: string) {
    this.socket.emit('join chat', chatId);
  }

  typing(chatId: string) {
    this.socket.emit('typing', chatId);
  }

  stopTyping(chatId: string) {
    this.socket.emit('stop typing', chatId);
  }

  onTyping(callback: () => void) {
    this.socket.on('typing', callback);
  }

  onStopTyping(callback: () => void) {
    this.socket.on('stop typing', callback);
  }

  onMessageReceived(callback: (msg: any) => void) {
    this.socket.on('message received', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('🔴 Socket disconnected');
    }
  }
}
