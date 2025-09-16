import { Routes } from '@angular/router';
import { ChatList } from './chat-list/chat-list';
import { ChatWindow } from './chat-window/chat-window';
import { Contacts } from './contacts/contacts';
import { authGuard } from "../guards/auth-guard";

export const DASHBOARD_ROUTES: Routes = [
  { path: 'chats', component: ChatList, canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatWindow, canActivate: [authGuard] }, // dynamic chat window
  { path: 'contacts', component: Contacts, canActivate: [authGuard] },
  { path: '', redirectTo: 'chats', pathMatch: 'full', canActivate: [authGuard] } // default route
];
