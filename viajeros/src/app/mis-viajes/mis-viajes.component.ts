import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { ViajeService } from '../services/viaje.service';
import * as bootstrap from 'bootstrap'; // Importa Bootstrap JS
import { GeocodingService } from '../services/geocoding.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mis-viajes',
  standalone: true,
  imports: [GoogleMapsComponent, RouterLink, CommonModule],
  templateUrl: './mis-viajes.component.html',
  styleUrl: './mis-viajes.component.css'
})
export class MisViajesComponent implements OnInit {

  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;
  selectedTrip: SearchResultMatchDto | null = null;
  createdTrips: SearchResultMatchDto[] = [];
  finishedTrips: SearchResultMatchDto[] = [];
  viewPending: boolean = true;
  viewFinished: boolean = false;

  travelDistance: string = '';
  travelTime: string = '';

  constructor(private cdr: ChangeDetectorRef, private viajesService: ViajeService, private geocodingService: GeocodingService) { }

  ngOnInit(): void {

    this.loadTrips();
  }

  // Función para convertir la fecha en un objeto Date
  private convertToDate(dateArray: any): Date {
    if (Array.isArray(dateArray)) {
      return new Date(
        dateArray[0], // Año
        dateArray[1] - 1, // Mes (Date usa 0 para enero, así que restamos 1)
        dateArray[2], // Día
        dateArray[3] || 0, // Hora (opcional)
        dateArray[4] || 0 // Minuto (opcional)
      );
    }
    return dateArray; // Si ya es Date, lo devolvemos tal cual
  }
  openTripDetails(trip: SearchResultMatchDto) {
    this.selectedTrip = trip;

    // Obtener latitud y longitud del origen
    this.geocodingService.getLatLong(trip.origin).subscribe({
      next: (response) => {
        if (response.results && response.results.length > 0) {
          this.originLat = response.results[0].geometry.location.lat;
          this.originLng = response.results[0].geometry.location.lng;
        }
      },
      error: (err) => {
        console.error("Error obteniendo coordenadas de origen: ", err);
      }
    });

    // Obtener latitud y longitud del destino
    this.geocodingService.getLatLong(trip.destination).subscribe({
      next: (response) => {
        if (response.results && response.results.length > 0) {
          this.destinationLat = response.results[0].geometry.location.lat;
          this.destinationLng = response.results[0].geometry.location.lng;
        }
      },
      error: (err) => {
        console.error("Error obteniendo coordenadas de destino: ", err);
      }
    });

    this.calculateDistanceAndTime();

    // Mostrar el modal con los detalles del viaje
    const modalElement = document.getElementById('tripDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Usa bootstrap.Modal después de la importación
      modal.show();
    }
  }

  
deleteTrip(tripId: SearchResultMatchDto): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.viajesService.deleteTrip(tripId.tripId).subscribe({
        next: (response) => {
          Swal.fire(
            'Eliminado!',
            'El viaje ha sido eliminado.',
            'success'
          );
          this.loadTrips();
          this.cdr.detectChanges();  // Forzar la detección de cambios
        },
        error: (err) => {
          console.error('Error al eliminar el viaje:', err);
          Swal.fire(
            'Error!',
            'No se pudo eliminar el viaje. Inténtalo de nuevo más tarde.',
            'error'
          );
        }
      });
    }
  });
}
  loadTrips() {
    this.viajesService.getAllCreatedAndInProgressByUser().subscribe({
      next: (trips) => {
        this.createdTrips = trips.map(trip => ({
          ...trip,
          departureTime: this.convertToDate(trip.departureTime),
          arrivalTime: this.convertToDate(trip.arrivalTime)
        }));
      },
      error: (err) => {
        console.error("Error al cargar viajes creados/incompletos:", err);
      }
    });

    this.viajesService.getAllFinishedByUser().subscribe({
      next: (trips) => {
        this.finishedTrips = trips.map(trip => ({
          ...trip,
          departureTime: this.convertToDate(trip.departureTime),
          arrivalTime: this.convertToDate(trip.arrivalTime)
        }));
      },
      error: (err) => {
        console.error("Error al cargar viajes finalizados:", err);
      }
    });
  }

  calculateDistanceAndTime() {
    const origen = this.selectedTrip?.origin
    const destino = this.selectedTrip?.destination

    // Verifica si origen y destino no están vacíos
    if (origen && destino) {
      this.geocodingService.getDistanceAndTime(origen, destino).subscribe(response => {
        if (response.status === 'OK') {
          const element = response.rows[0].elements[0];
          this.travelDistance = element.distance.text;
          this.travelTime = element.duration.text;
          console.log(`Distancia: ${this.travelDistance}, Tiempo: ${this.travelTime}`);
        } else {
          console.error('Error al obtener la distancia y el tiempo', response.status);
        }
      }, error => {
        console.error('Error en la solicitud', error);
      });
    } else {
      // Mostrar mensaje de error si alguno de los campos está vacío
      console.error('Origen y destino son requeridos');
      Swal.fire('Error', 'Debes completar ambos campos: Origen y Destino', 'error');
    }
  }
  // Mostrar viajes pendientes
  showPending() {
    this.viewPending = true;
    this.viewFinished = false;
  }

  // Mostrar viajes finalizados
  showFinished() {
    this.viewPending = false;
    this.viewFinished = true;
  }
}
