import { Component, OnInit } from '@angular/core';
import { GoogleMapsComponent } from "../google-maps/google-maps.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { GeocodingService } from '../services/geocoding.service';
import { LocalidadService } from '../services/localidad.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-trip',
  standalone: true,
  imports: [GoogleMapsComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-trip.component.html',
  styleUrl: './search-trip.component.css'
})
export class SearchTripComponent  implements OnInit {
  originLat = -34.6037; // Coordenada de ejemplo (Buenos Aires)
  originLng = -58.3816;

  destinationLat = -34.9011; // Coordenada de ejemplo (Montevideo)
  destinationLng = -56.1645;

  travelDistance: string = '';
  travelTime: string = '';

  kmPorLitro: number = 0;
  precioNafta: number = 0;
  costoTotal: number = 0;

  searchTripForm: FormGroup;
  localidadesOrigen: { id: number, nombre: string }[] = []; // Lista de sugerencias de localidades
  localidadesDestino: { id: number, nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private localidadService: LocalidadService,
    private geocodingService: GeocodingService
  ) {
    this.searchTripForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      aceptaMascotas: ['', Validators.required],
      equipajePermitido: ['', Validators.required],
      aceptaFumar: ['', Validators.required],
      localidadInicioId: [''],
      localidadFinId: ['']
    });
  }

  ngOnInit(): void {}

  // Método para buscar localidades
  searchLocalidades(campo: string): void {
    const query = this.searchTripForm.get(campo)?.value;
    if (query && query.length > 2) {
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

  // Método para seleccionar una localidad y almacenar su ID y nombre
  selectLocalidad(campo: string, localidad: { id: number, nombre: string }): void {
    if (campo === 'origen') {
      this.searchTripForm.get('origen')?.setValue(localidad.nombre);
      this.searchTripForm.get('localidadInicioId')?.setValue(localidad.id);
      this.localidadesOrigen = []; // Limpiar las sugerencias de origen
    } else if (campo === 'destino') {
      this.searchTripForm.get('destino')?.setValue(localidad.nombre);
      this.searchTripForm.get('localidadFinId')?.setValue(localidad.id);
      this.localidadesDestino = []; // Limpiar las sugerencias de destino
    }
    // Ejecuta el cálculo solo si ambos, origen y destino, ya están seleccionados
    const origenSeleccionado = this.searchTripForm.get('origen')?.value;
    const destinoSeleccionado = this.searchTripForm.get('destino')?.value;

    if (origenSeleccionado && destinoSeleccionado) {
      this.calcularDistanciaYTiempo();
    }
  }
  // Método para buscar la latitud y longitud de la localidad de origen
  searchLocalidadOrigen() {
    const origen = this.searchTripForm.get('origen')?.value;
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
    const destino = this.searchTripForm.get('destino')?.value;
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

  // Método para calcular la distancia y tiempo entre origen y destino
  calcularDistanciaYTiempo() {
    if (this.originLat && this.originLng && this.destinationLat && this.destinationLng) {
      // Aquí deberías implementar la lógica o usar un servicio para calcular la distancia y tiempo.
      // Por ejemplo, puedes usar Google Maps Distance Matrix API o calcular la distancia basada en coordenadas.
      // De manera simplificada, puedes asignar valores simulados:
      this.travelDistance = '200 km';  // Ejemplo de distancia simulada
      this.travelTime = '3 horas';     // Ejemplo de tiempo estimado
    }
  }
  submitSearchTripForm(){

  }
}