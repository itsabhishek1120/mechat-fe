import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from "../../shared/navbar/navbar";
import { GlobalService } from "../../services/global.service";

interface Chat {
  id: number;
  username: string;
  userid: string,
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

@Component({
  selector: 'app-chat-list',
  imports: [CommonModule, Navbar],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss'
})
export class ChatList {

  chats: Chat[] = [];

  constructor(private router: Router, private globalService: GlobalService){}

  async ngOnInit(): Promise<void> {
    try {
      const chatDetails = await this.globalService.get("chat/fetch-all-chats");
      console.log("chatDetails::", chatDetails);
      const chats = chatDetails.data;
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
      let arr: any[] = [];
      for(const chat of chats){
        const ch = chat.users.filter((u: any) => u.username != currentUser.username );
        console.log("chh:",ch);
        
        arr.push({
          id: chat._id,
          username: ch[0].username,
          userid: ch[0]._id,
          lastMessage: chat?.latestMessage?.content ? chat.latestMessage.content : ".",
          avatar: 'https://i.pravatar.cc/150?img=2',
          time: chat?.latestMessage?.createdAt ? this.globalService.formatRelativeTime(chat.latestMessage.createdAt) : "",
          unread: 1
        });
      }
      this.chats = [...arr];
      console.log("this.chats:::",this.chats);
    } catch (error) {
      console.error("Unable to fetch chats:", error);
    }
  }

  // chats: Chat[] = [
  //   {
  //     id: 1,
  //     username: 'Alice Johnson',
  //     avatar: 'https://i.pravatar.cc/150?img=1',
  //     lastMessage: 'Hey, are we still meeting today?',
  //     time: '10:15 AM',
  //     unread: 2,
  //   },
  //   {
  //     id: 2,
  //     username: 'Bob Williams',
  //     avatar: 'https://i.pravatar.cc/150?img=2',
  //     lastMessage: 'Got it, thanks!',
  //     time: 'Yesterday',
  //     unread: 0,
  //   },
  //   {
  //     id: 3,
  //     username: 'Sarah Lee',
  //     avatar: 'https://i.pravatar.cc/150?img=3',
  //     lastMessage: 'Let’s finalize the designs tomorrow.',
  //     time: 'Mon',
  //     unread: 5,
  //   },
  // ];

  openChat(chat: any){
    console.log("Open the chat for: ", chat);
    this.router.navigate(['/chat', chat?.id],{
      state : chat
    });
  }
}
