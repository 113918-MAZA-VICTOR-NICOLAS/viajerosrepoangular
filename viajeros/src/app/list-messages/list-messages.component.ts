import { Component } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";

@Component({
  selector: 'app-list-messages',
  standalone: true,
  imports: [PhoneNavbarComponent],
  templateUrl: './list-messages.component.html',
  styleUrl: './list-messages.component.css'
})
export class ListMessagesComponent {

}
