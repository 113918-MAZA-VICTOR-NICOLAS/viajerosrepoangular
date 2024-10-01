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

@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-trip.component.html',
  styleUrl: './new-trip.component.css'
})
export class NewTripComponent implements OnInit {


  createTripForm: FormGroup;
  localidadesOrigen: { id: number, nombre: string }[] = []; // Lista de sugerencias de localidades

  localidadesDestino: { id: number, nombre: string }[] = [];
  vehiculos: CarResponseDto[] = []; // Almacena los vehículos del usuario

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router, private localidadService: LocalidadService,
    private viajeservice: ViajeService
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
  
    console.log(tripData);  // Verifica los valores que se enviarán
    if (this.createTripForm.valid) {
      // Enviar el viaje al backend
      this.viajeservice.registerTrip(tripData).subscribe(
        (response) => { console.log(response); },
        (error) => { console.log(error); }
      );
    }
  }
  
}