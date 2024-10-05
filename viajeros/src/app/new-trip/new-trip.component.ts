import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Router, RouterLink } from '@angular/router';
import { CarResponseDto } from '../models/Vehicle/CarResponseDto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalidadService } from '../services/localidad.service';
import { NewTripRequestDto } from '../models/Viajes/NewTripRequestDto';
import { ViajeService } from '../services/viaje.service';
import { routes } from '../app.routes';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { GeocodingService } from '../services/geocoding.service';
declare var bootstrap: any;  // Declarar 'bootstrap' como variable global
@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, GoogleMapsComponent],
  templateUrl: './new-trip.component.html',
  styleUrl: './new-trip.component.css'
})
export class NewTripComponent implements OnInit {
 
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;


  travelDistance: string = '';
  travelTime: string = '';


  kmPorLitro: number = 0;
  precioNafta: number = 0;
  costoTotal: number = 0;

  createTripForm: FormGroup;
  localidadesOrigen: { id: number, nombre: string }[] = []; // Lista de sugerencias de localidades

  localidadesDestino: { id: number, nombre: string }[] = [];
  vehiculos: CarResponseDto[] = []; // Almacena los vehículos del usuario
  vehicle!: CarResponseDto;
  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router, private localidadService: LocalidadService,
    private viajeservice: ViajeService,
    private geocodingService: GeocodingService
  ) {
    this.createTripForm = this.fb.group({
      idVehiculo: ['', Validators.required],
      localidadInicioId: ['', Validators.required],
      origen: ['', Validators.required], // Solo el nombre visible
      localidadFinId: ['', Validators.required],
      destino: ['', Validators.required], // Solo el nombre visible
      fechaHoraInicio: ['', Validators.required],
      gastoTotal: ['', Validators.required],
      asientosDisponibles: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      aceptaMascotas: [null, Validators.required],
      aceptaFumar: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserVehicles();
  }

  // Carga los vehículos del usuario
  loadUserVehicles() {
    this.vehicleService.getAllCars().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Error al cargar los vehículos', error);
        Swal.fire('Error', 'Hubo un problema al cargar tus vehículos', 'error');
      }
    });
  }
  // Método para buscar localidades
  searchLocalidades(campo: string): void {
    const query = this.createTripForm.get(campo)?.value;
    if (query && query.length > 2) { // Busca si el usuario ha ingresado al menos 3 caracteres
      this.localidadService.searchLocalidades(query).subscribe((data) => {
        if (campo === 'origen') {
          this.localidadesOrigen = data.slice(0, 4); // Limitar a 4 resultados para origen
        } else if (campo === 'destino') {
          this.localidadesDestino = data.slice(0, 4); // Limitar a 4 resultados para destino
        }
      });
    } else {
      if (campo === 'origen') {
        this.localidadesOrigen = []; // Limpiar las sugerencias de origen
      } else if (campo === 'destino') {
        this.localidadesDestino = []; // Limpiar las sugerencias de destino
      }
    }
  }
  // Método para buscar la latitud y longitud de la localidad de origen
  searchLocalidadOrigen() {
    const origen = this.createTripForm.get('origen')?.value;
    if (origen) {
      this.geocodingService.getLatLong(origen).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.originLat = location.lat;
            this.originLng = location.lng;
            console.log(`Origen - Latitud: ${this.originLat}, Longitud: ${this.originLng}`);
          } else {
            Swal.fire('Error', 'No se encontraron resultados para la localidad de origen', 'error');
          }
        },
        error: (error) => {
          console.error('Error al obtener coordenadas de origen', error);
          Swal.fire('Error', 'Hubo un problema al obtener las coordenadas de origen', 'error');
        }
      });
    }
  }

  // Método para buscar la latitud y longitud de la localidad de destino
  searchLocalidadDestino() {
    const destino = this.createTripForm.get('destino')?.value;
    if (destino) {
      this.geocodingService.getLatLong(destino).subscribe({
        next: (response) => {
          if (response.status === 'OK') {
            const location = response.results[0].geometry.location;
            this.destinationLat = location.lat;
            this.destinationLng = location.lng;
            console.log(`Destino - Latitud: ${this.destinationLat}, Longitud: ${this.destinationLng}`);
          } else {
            Swal.fire('Error', 'No se encontraron resultados para la localidad de destino', 'error');
          }
        },
        error: (error) => {
          console.error('Error al obtener coordenadas de destino', error);
          Swal.fire('Error', 'Hubo un problema al obtener las coordenadas de destino', 'error');
        }
      });
    }
  }
  
  calculateDistanceAndTime() {
    const origen = this.createTripForm.get('origen')?.value;
    const destino = this.createTripForm.get('destino')?.value;

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


  calcularCosto() {

    const distancia = parseInt(this.travelDistance,10)
    if (this.kmPorLitro > 0 && this.precioNafta > 0) {
      this.costoTotal = (distancia / this.kmPorLitro) * this.precioNafta;
    } else {
      this.costoTotal = 0;
    }
  }

  
  agregarCosto() {
    // Lógica para agregar el costo
    this.createTripForm.patchValue({
      gastoTotal: this.costoTotal
    });
    
    // Llamar a la función que cerrará el modal
    this.cerrarModal();
  }

  cerrarModal() {
    // Obtener el modal por su ID
    const modalElement = document.getElementById('exampleModal');
    
    // Verifica si se obtuvo el elemento correctamente
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }



  vehicleSelected(car: CarResponseDto) {
    this.vehicle = car;
  }


  // Método para seleccionar una localidad y almacenar su ID y nombre
  selectLocalidad(campo: string, localidad: { id: number, nombre: string }): void {
    if (campo === 'origen') {
      this.createTripForm.get('origen')?.setValue(localidad.nombre);
      this.createTripForm.get('localidadInicioId')?.setValue(localidad.id);
      this.localidadesOrigen = []; // Limpiar las sugerencias de origen
    } else if (campo === 'destino') {
      this.createTripForm.get('destino')?.setValue(localidad.nombre);
      this.createTripForm.get('localidadFinId')?.setValue(localidad.id);
      this.localidadesDestino = []; // Limpiar las sugerencias de destino
    }
    // Ejecuta el cálculo solo si ambos, origen y destino, ya están seleccionados
    const origenSeleccionado = this.createTripForm.get('origen')?.value;
    const destinoSeleccionado = this.createTripForm.get('destino')?.value;

    if (origenSeleccionado && destinoSeleccionado) {
      this.calculateDistanceAndTime();
    }
  }



  submitTripForm() {
    const iduser = localStorage.getItem("userId");

    // Crear tripData manualmente con los valores relevantes
    const tripData: NewTripRequestDto = {
      idVehiculo: Number(this.createTripForm.get('idVehiculo')?.value),
      idChofer: Number(iduser),
      localidadInicioId: this.createTripForm.get('localidadInicioId')?.value,
      localidadFinId: this.createTripForm.get('localidadFinId')?.value,
      fechaHoraInicio: this.createTripForm.get('fechaHoraInicio')?.value,
      gastoTotal: this.createTripForm.get('gastoTotal')?.value,
      asientosDisponibles: this.createTripForm.get('asientosDisponibles')?.value,
      aceptaMascotas: this.createTripForm.get('aceptaMascotas')?.value,
      aceptaFumar: this.createTripForm.get('aceptaFumar')?.value
    };

    if (this.createTripForm.valid) {
      // Enviar el viaje al backend
      this.viajeservice.registerTrip(tripData).subscribe(
        (response) => {
          console.log(response);
          // Mostrar alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Viaje registrado!',
            text: 'El viaje se ha registrado correctamente.',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/profile'])
        },
        (error) => {
          console.log(error);
          // Mostrar alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el viaje. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }

  }
}