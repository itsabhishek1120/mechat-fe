import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GlobalService } from "../../services/global.service";

interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

interface Chat {
  name: string,
  status: string,
  profile: string
}
@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss'
})
export class ChatWindow {

  chatDetail: Chat = {
    name: '-',
    status: 'online',
    profile: '-'
  };

  messages: Message[] = [];

  constructor(private route: ActivatedRoute, private globalService: GlobalService) {}

  ngOnInit(): void {
    try {
      this.route.paramMap.subscribe(async params => {
      const chat = history?.state;
      console.log(">>>>",chat,":::",params);
      this.chatDetail.name = chat?.username;
      this.chatDetail.status = 'online';
      this.chatDetail.profile = chat?.avatar;

      if (chat?.id) {        
        this.fetchChatMessages(chat.id);
      }
    });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  async fetchChatMessages(chatId: any){
    try {
      const mssgs = await this.globalService.get(`message/get-messages/${chatId}`);
      console.log("mssgggggggggg::",mssgs);
      const currentUser = this.globalService.currentUser;
      for(const mssg of mssgs.data){
        this.messages.push({
          id: mssg._id,
          sender: mssg.sender.username == currentUser.username ? "me" : "other",
          text: mssg.content,
          time: this.globalService.formatRelativeTime(mssg.createdAt)
        });
      }
      console.log("this.messages>>>>>",this.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  // messages: Message[] = [
  //     { id: 1, sender: 'other', text: 'Hey! How are you?', time: '10:12 AM' },
  //     { id: 2, sender: 'me', text: 'I’m good ❄️, working on the new app design.', time: '10:13 AM' },
  //     { id: 3, sender: 'other', text: 'That sounds awesome! Show me later.', time: '10:14 AM' },
  //     { id: 4, sender: 'me', text: 'Sure, will send you a demo soon 🚀', time: '10:15 AM' },
  //   ];

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
