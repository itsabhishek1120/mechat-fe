import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GlobalService } from "../../services/global.service";
import { SocketService } from "../../services/socket.service";
import { AlertService } from "../../services/alert.service";

interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

interface Chat {
  userid: string,
  chatid: string,
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  isContactAdded: boolean = true;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  chatDetail: Chat = {
    userid: '',
    chatid: '',
    name: '-',
    status: 'online',
    profile: '-',
  };

  messages: Message[] = [];
  contacts: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  constructor(
    private route: ActivatedRoute, 
    private globalService: GlobalService, 
    private socketService: SocketService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    try {
      this.route.paramMap.subscribe(async params => {
      const chat = history?.state;
      console.log(">>>>",chat,":::",params);
      this.chatDetail.name = chat?.username;
      this.chatDetail.status = 'online';
      this.chatDetail.profile = chat?.avatar;
      this.chatDetail.userid = chat?.userid;
      this.chatDetail.chatid = chat?.id;
      this.contacts = await this.globalService.getContacts();
      if(!this.contacts.some(item => item.id === chat?.userid)) this.isContactAdded = false;
      
      if (chat?.id) {        
        this.fetchChatMessages(chat.id);
        this.socketService.joinChat(chat.id);

        // Listen for new messages
        this.socketService.onMessageReceived((message: any) => {
          console.log("----------->>",message.content);
          if (message.chat._id === this.chatDetail.chatid) {
            this.messages.push({
              id: message._id,
              sender: message.sender._id === this.currentUser.id ? 'me' : 'other',
              text: message.content,
              time: this.globalService.formatRelativeTime(message.createdAt),
            });
          }
        });
      }
    });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  async fetchChatMessages(chatId: any){
    try {
      const mssgs = await this.globalService.get(`message/get-messages/${chatId}`);
      console.log("mssgg::",mssgs);
      for(const mssg of mssgs.data){
        this.messages.push({
          id: mssg._id,
          sender: mssg.sender.username == this.currentUser.username ? "me" : "other",
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

    async sendMessage() {
      if (!this.newMessage.trim()) return;
      console.log("this.chatDetail>>",this.chatDetail);
      const messageText = this.newMessage;

      const mssgTemp: Message = {
        id: Date.now(),
        sender: 'me',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      this.messages.push(mssgTemp);
      this.newMessage = '';
      
      try {
        const mssgBody = { 
          reciever: this.chatDetail.userid,
          chatId: this.chatDetail.chatid,
          content: messageText
        };
        const sendMssg = await this.globalService.post('message/send', mssgBody);
        console.log("sent mssg::",sendMssg);
        this.scrollToBottom();
      } catch (error) {
        console.error('Message send failed:', error);
        const index = this.messages.findIndex(m => m.id === mssgTemp.id);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }
      
    }

    async addContact(){
      const contact = {id: this.chatDetail.userid, name: this.chatDetail.name};
      try {
        console.log('Add contact:', contact);
        this.alertService.confirm(`Adding ${contact.name} to contacts`).then(async res => {
          if (res.isConfirmed) {
            console.log("Yesssssssssss");
            const addContact = await this.globalService.post('user/add-contact',{
              userId: this.currentUser.id,
              contactId : contact.id
            })
            console.log("Added contact:",addContact);
            this.isContactAdded = true;

            this.alertService.success("Contact added");
          } else {
            console.log("No!!!!");
          }
        })
      } catch (error) {
        console.error("Error adding contact:", error);
      }
      
    }
}
