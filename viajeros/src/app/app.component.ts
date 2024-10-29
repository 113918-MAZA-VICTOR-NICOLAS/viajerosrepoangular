import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'viajeros';
  userIsAdm: boolean = false;  // Por defecto false

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.getUserRole().subscribe(role => {
      if (role) {
        this.userIsAdm = role === 'ADMIN'; // Actualizar según el rol
      } else {
        this.userIsAdm = false; // Si no hay rol, el usuario no es admin
      }
    });
  }

  // Función que espera a que el rol esté disponible en localStorage
  waitForUserRole(): void {
    const checkRole = () => {
      const rol = localStorage.getItem('rol');
      if (rol) {
        this.userIsAdm = rol === 'ADMIN';
      } else {
        setTimeout(checkRole, 100); // Vuelve a intentar en 100ms si el rol no está disponible
      }
    };

    checkRole();  // Comienza el ciclo de verificación
  }

  // Lógica de logout
  logout() {
    this.loginService.logout();
    this.userIsAdm = false;
    this.router.navigate(['/home']); // Redirigir al home después del logout
  }
}