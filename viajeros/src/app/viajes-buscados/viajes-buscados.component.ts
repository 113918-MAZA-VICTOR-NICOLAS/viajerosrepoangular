import { Component } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";

@Component({
  selector: 'app-viajes-buscados',
  standalone: true,
  imports: [GoogleMapsComponent],
  templateUrl: './viajes-buscados.component.html',
  styleUrl: './viajes-buscados.component.css'
})
export class ViajesBuscadosComponent {
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;
}
