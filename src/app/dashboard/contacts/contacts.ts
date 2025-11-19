import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GlobalService } from "../../services/global.service";
import { AlertService } from "../../services/alert.service";

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
  contactArr: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('userData') || '{}');


  constructor(private globalService: GlobalService, private alertService: AlertService){}

  async ngOnInit(){
    try {
      const allUsers = await this.globalService.get('user/get-users');
      this.contactArr = await this.globalService.getContacts();
      for(const user of allUsers.data){
        if(this.currentUser.id != user._id && !this.contactArr.some(item => item.id === user._id)){
          this.contacts.push({
            id: user._id,
            name: user.username
          });
        }
      }
      console.log("this.contactArr::",this.contactArr);
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

  get filteredAddedContacts() {
    if (!this.searchText.trim()) {
      return this.contactArr; // show all
    }

    const s = this.searchText.toLowerCase();
    console.log("this.contactArr>>",this.contactArr);
    

    return this.contactArr.filter(c =>
      c.name.toLowerCase().includes(s)
    );
  }

  addContact(contact: any) {
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
          this.contacts = this.contacts.filter(c => c.id !== contact.id);
          this.contactArr = [...this.contactArr, contact];

          this.alertService.success("Contact added");
        } else {
          console.log("No!!!!");
        }
      })
    } catch (error) {
      console.error("Error adding contact:", error);
    }
    
  }

  openChat(contact: any){
    console.log("Open contact for :",contact);
  }

}
