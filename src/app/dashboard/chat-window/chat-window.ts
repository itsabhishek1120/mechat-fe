import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}
@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss'
})
export class ChatWindow {

  constructor(private route: ActivatedRoute) {
  this.route.paramMap.subscribe(params => {
    console.log("Parammm::",params);
    const state = history.state;
    console.log(">>>>",state);
  });
}

  messages: Message[] = [
      { id: 1, sender: 'other', text: 'Hey! How are you?', time: '10:12 AM' },
      { id: 2, sender: 'me', text: 'I’m good ❄️, working on the new app design.', time: '10:13 AM' },
      { id: 3, sender: 'other', text: 'That sounds awesome! Show me later.', time: '10:14 AM' },
      { id: 4, sender: 'me', text: 'Sure, will send you a demo soon 🚀', time: '10:15 AM' },
    ];

    newMessage = '';

    sendMessage() {
      if (!this.newMessage.trim()) return;
      this.messages.push({
        id: Date.now(),
        sender: 'me',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      this.newMessage = '';
    }
}
