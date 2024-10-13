import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViajeService } from '../services/viaje.service';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { Chat } from '../models/Chat/Chat';

@Component({
  selector: 'app-subirme',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subirme.component.html',
  styleUrl: './subirme.component.css'
})
export class SubirmeComponent implements OnInit {

  tripId: string | null = null;  // Variable para almacenar el tripId
  tripIdConvertedNumber: number = 0; // Variable para almacenar el tripId convertido a número
  viajeSelected!: SearchResultMatchDto;

  constructor(private route: ActivatedRoute, private viajeservice: ViajeService, private router:Router) { }

  ngOnInit(): void {
    // Capturar el tripId desde los parámetros de la ruta
    this.tripId = this.route.snapshot.paramMap.get('tripId');
  
    // Convertir tripId a número si es válido
    if (this.tripId) {
      this.tripIdConvertedNumber = +this.tripId; // El signo '+' convierte el string a número
    }
  
    this.viajeservice.getTripById(this.tripIdConvertedNumber).subscribe(
      (response: SearchResultMatchDto) => {
        // Convertir 'date' array a objeto Date
        if (Array.isArray(response.date)) {
          response.date = new Date(
            response.date[0],
            response.date[1] - 1, // Meses en JavaScript empiezan en 0
            response.date[2],
            response.date[3] || 0, // Hora
            response.date[4] || 0  // Minutos
          );
        }
  
        // Asegurar que 'departureTime' y 'arrivalTime' sean objetos Date
        response.departureTime = new Date(response.departureTime);
        response.arrivalTime = new Date(response.arrivalTime);
  
        // Asignar el viaje procesado a viajeSelected
        this.viajeSelected = response;
      },
      (error) => { console.log(error); }
    );
  }
  

  
  gotochat() {
    this.router.navigate(['/chat', this.tripId]);
  }

  onSubirmeClick() {
    // Lógica para el botón "Subirme"
  }
}