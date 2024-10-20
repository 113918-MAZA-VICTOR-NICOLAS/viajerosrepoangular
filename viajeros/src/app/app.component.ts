import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { PrincipalComponent } from "./principal/principal.component";
import { VehicleComponent } from "./profilecomponents/vehicle/vehicle.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ViajesBuscadosComponent } from "./viajes-buscados/viajes-buscados.component";
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, RegisterComponent, PrincipalComponent, VehicleComponent, EditProfileComponent, ViajesBuscadosComponent, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'viajeros';

  constructor(private router:Router, private loginService: LoginService){}

  userIsAdmin(): boolean {
    const rol = localStorage.getItem('rol');
    if (rol == 'ADMIN') {
      return true;
    } else {
      return false;
    }

  }
  logout() {
    // Aquí pones tu lógica de logout, por ejemplo:
    this.loginService.logout();
    this.router.navigate(['/login']); // Redirigir al login
  }
  
}
