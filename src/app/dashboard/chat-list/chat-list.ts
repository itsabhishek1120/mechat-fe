import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

@Component({
  selector: 'app-chat-list',
  imports: [CommonModule],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatList {

  constructor(private router: Router){}

  chats: Chat[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Hey, are we still meeting today?',
      time: '10:15 AM',
      unread: 2,
    },
    {
      id: 2,
      name: 'Bob Williams',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'Got it, thanks!',
      time: 'Yesterday',
      unread: 0,
    },
    {
      id: 3,
      name: 'Sarah Lee',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Let’s finalize the designs tomorrow.',
      time: 'Mon',
      unread: 5,
    },
  ];

  openChat(chat: any){
    console.log("Open the chat for: ", chat?.name);
    this.router.navigate(['/chat', chat?.id],{
      state : chat
    });
  }
}
