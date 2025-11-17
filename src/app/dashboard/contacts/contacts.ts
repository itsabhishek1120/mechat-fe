import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GlobalService } from "../../services/global.service";

interface Contact {
  id: number,
  name: string
}
@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts {
  searchText = "";
  contacts: Contact[] = [];


  constructor(private globalService: GlobalService){}

  async ngOnInit(){
    try {
      const allUsers = await this.globalService.get('user/get-users');
      console.log(">>>>>",allUsers);
      for(const user of allUsers.data){
        this.contacts.push({
          id: user._id,
          name: user.username
        });
      }
      console.log("Contacts::",this.contacts);
      
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  }

  // contacts = [
  //   { name: 'Rahul Sharma', status: 'Hey there! I am using ChatApp' },
  //   { name: 'Aman Verma', status: 'Available' },
  //   { name: 'Neha Gupta', status: 'Busy' },
  //   { name: 'Sakshi Patel', status: 'At work' },
  //   { name: 'Vikas Mehta', status: 'Battery about to die 😅' },
  // ];

  get filteredContacts() {
    if (!this.searchText.trim()) {
      return this.contacts; // show all
    }

    const s = this.searchText.toLowerCase();

    return this.contacts.filter(c =>
      c.name.toLowerCase().includes(s)
    );
  }

  addContact(contact: any) {
    console.log('Add contact:', contact);
    // You can call your API or update local array here
  }

}
