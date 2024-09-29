import { Component } from '@angular/core';
import { PhoneNavbarComponent } from "../phone-navbar/phone-navbar.component";
import { LoginService } from '../services/login.service';
import { Route, Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserDataDto } from '../models/User/UserDataDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PhoneNavbarComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user = {
    name: 'Juan Lopez',
    history: 'Me gusta viajar con compania',
  }

  userdata!: UserDataDto;

  constructor(private loginservice: LoginService, private routes: Router, private userservice: UserService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userservice.getUserDataById().subscribe(
      (response) => {
        this.userdata = response
        console.log(response)
      },
      (error) => { console.log(error) }
    );
  }

  logout() {

    Swal.fire({
      title: "¿Seguro que quiere desloguearse?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Desloguear"
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginservice.logout();
        this.routes.navigate(['/home']);
      
      }
    });


  }
}
