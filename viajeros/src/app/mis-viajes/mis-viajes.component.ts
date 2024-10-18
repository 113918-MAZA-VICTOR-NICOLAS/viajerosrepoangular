import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';
import { ViajeService } from '../services/viaje.service';
import * as bootstrap from 'bootstrap'; // Importa Bootstrap JS
import { GeocodingService } from '../services/geocoding.service';
import Swal from 'sweetalert2';
import { PassengersDto } from '../models/Viajes/PassengersDto';
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
  isChofer: boolean = false;
  isChoferCard: boolean = false;
  passengers: PassengersDto[] = [];
  userId:number = 0;
  constructor(private cdr: ChangeDetectorRef, private viajesService: ViajeService, private geocodingService: GeocodingService) { }

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    if(id){
      this.userId = parseInt(id,10);
    }
    this.loadTrips();

  }
  getPassengers(tripid:number): void {
    this.viajesService.getPassengersByTripId(tripid).subscribe(
      (data: PassengersDto[]) => {
        this.passengers = data;
      },
      (error) => {
        console.error('Error al obtener los pasajeros:', error);
      }
    );
  }
  finalizarViaje(trip: SearchResultMatchDto) {
    this.viajesService.finalizarViaje(trip.tripId).subscribe({
      next: (response) => {
        Swal.fire('¡Viaje finalizado!', 'El viaje ha sido finalizado correctamente.', 'success');
        this.loadTrips();  // Recargar los viajes actualizados
      },
      error: (error) => {
        console.error('Error al finalizar el viaje:', error);
        Swal.fire('Error', 'No se pudo finalizar el viaje. Intenta de nuevo más tarde.', 'error');
      }
    });
  }
  

  soychofer(tripid: number) {
    const userid = localStorage.getItem('userId');

    if (userid) { // Verificar si userid no es null
      this.viajesService.soyChoferDelViaje(tripid, parseInt(userid, 10)).subscribe(
        (response) => {
          console.log(response)
          this.isChofer = response.ischofer;
          this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
        },
        (error) => {
          console.error('Error al verificar si es chofer:', error);
        }
      );
    } else {
      console.error('No se encontró userId en el localStorage');
    }
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
    this.soychofer(this.selectedTrip.tripId)
    console.log(this.isChofer)
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

  deleteTripInModal(){
    if(this.selectedTrip){
      this.deleteTrip(this.selectedTrip)
    }
  
   
  }
  deleteTrip(tripId: SearchResultMatchDto): void {
    const userId = localStorage.getItem('userId');
    
    // Verifica si el usuario es chofer
    this.viajesService.soyChoferDelViaje(tripId.tripId, parseInt(userId ?? '0', 10)).subscribe(
      (response) => {
        if (response.ischofer) {
          // Si el usuario es chofer, seguir la lógica actual
          this.handleDeleteAsChofer(tripId);
        } else {
          // Si es pasajero, eliminarlo como pasajero y solicitar reintegro
          this.handleDeleteAsPassenger(tripId, parseInt(userId ?? '0', 10));
        }
      },
      (error) => {
        console.error('Error al verificar si es chofer:', error);
      }
    );
  }
  private handleDeleteAsChofer(tripId: SearchResultMatchDto): void {
    this.viajesService.getPassengersByTripId(tripId.tripId).subscribe(
      (data: PassengersDto[]) => {
        this.passengers = data;
  
        if (this.passengers.length > 0) {
          // Mostrar advertencia de reintegros
          Swal.fire({
            title: 'Advertencia!',
            text: "Este viaje tiene pasajeros. Si eliminas el viaje, se realizarán reintegros a todos los pasajeros.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar y reembolsar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Si el usuario confirma, eliminar el viaje completo
              this.executeDeleteTrip(tripId);
            } else {
              this.passengers = [];
            }
          });
        } else {
          // Si no hay pasajeros, eliminar el viaje directamente
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
              this.executeDeleteTrip(tripId);
            }
          });
        }
      },
      (error) => {
        console.error('Error al obtener los pasajeros:', error);
        Swal.fire(
          'Error',
          'No se pudo verificar los pasajeros del viaje. Inténtalo de nuevo más tarde.',
          'error'
        );
      }
    );
  }
  private handleDeleteAsPassenger(tripId: SearchResultMatchDto, userId: number): void {
    Swal.fire({
      title: '¿Solicitar reintegro?',
      text: "Estás a punto de solicitar un reintegro y eliminar tu participación en este viaje.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, solicitar reintegro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Solicitar el reintegro y eliminar al pasajero del viaje
        this.viajesService.deletePassengerFromTrip(tripId.tripId, userId).subscribe({
          next: (response) => {
            Swal.fire(
              'Eliminado!',
              'Tu participación en el viaje ha sido eliminada y se ha solicitado el reintegro.',
              'success'
            );
            this.loadTrips();
            this.cdr.detectChanges(); // Forzar la detección de cambios
          },
          error: (err) => {
            console.error('Error al eliminar al pasajero y solicitar reintegro:', err);
            Swal.fire(
              'Error!',
              'No se pudo procesar tu solicitud. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        });
      }
    });
  }
  

   // Método para traducir los estados del viaje
   translateStatus(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'PENDIENTE';
      case 'IN PROGRESS':
        return 'EN PROGRESO';
      case 'FINISHED':
        return 'FINALIZADO';
      default:
        return status; // Devuelve el estado original si no coincide con ninguno de los casos
    }
  }
  
  // Método para eliminar el viaje
  private executeDeleteTrip(tripId: SearchResultMatchDto): void {
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
