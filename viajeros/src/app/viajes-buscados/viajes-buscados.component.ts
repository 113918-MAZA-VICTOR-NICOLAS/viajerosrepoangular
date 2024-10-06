import { Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { RouterLink } from '@angular/router';
import { ViajeService } from '../services/viaje.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viajes-buscados',
  standalone: true,
  imports: [GoogleMapsComponent, RouterLink, CommonModule],
  templateUrl: './viajes-buscados.component.html',
  styleUrl: './viajes-buscados.component.css'
})
export class ViajesBuscadosComponent implements OnInit {
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;


  matchListrip: SearchResultMatchDto[] = [];
  unmatchRecomendationListTrip: SearchResultMatchDto[] = [];

  constructor(private viajeservice: ViajeService) { }
  ngOnInit(): void {
    this.matchListrip = this.viajeservice.listresultorigin.map(trip => {
      // Convertir el arreglo de números a un objeto Date
      if (Array.isArray(trip.departureTime)) {
        trip.departureTime = new Date(
          trip.departureTime[0], 
          trip.departureTime[1] - 1, // Resta 1 porque los meses en Date van de 0 a 11
          trip.departureTime[2], 
          trip.departureTime[3], 
          trip.departureTime[4]
        );
      }
      return trip;
    });
  }
}
