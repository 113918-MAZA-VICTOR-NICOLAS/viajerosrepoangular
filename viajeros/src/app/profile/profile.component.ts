import { Component } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { LoginService } from '../services/login.service';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PhoneNavbarComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user = {
    name:'Juan Lopez',
    history:'Me gusta comer comida',
  }
constructor(private loginservice:LoginService, private routes:Router){}

logout(){
  this.loginservice.logout();
  this.routes.navigate(['/principal']);
}
}
