import { Routes } from '@angular/router';
import { ChatList } from './chat-list/chat-list';
import { ChatWindow } from './chat-window/chat-window';
import { Contacts } from './contacts/contacts';

export const DASHBOARD_ROUTES: Routes = [
  { path: 'chats', component: ChatList },
  { path: 'chat/:id', component: ChatWindow }, // dynamic chat window
  { path: 'contacts', component: Contacts },
  { path: '', redirectTo: 'chats', pathMatch: 'full' } // default route
];
