import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { PrincipalComponent } from "./principal/principal.component";
import { VehicleComponent } from "./profilecomponents/vehicle/vehicle.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ViajesBuscadosComponent } from "./viajes-buscados/viajes-buscados.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, RegisterComponent, PrincipalComponent, VehicleComponent, EditProfileComponent, ViajesBuscadosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'viajeros';
}
