import { Component } from '@angular/core';
import { AdminService } from '../../services/Admin/admin.service';
import { CarResponseDto } from '../../models/Vehicle/CarResponseDto';
import { CommonModule } from '@angular/common';
import { FiltroPorPatentePipe } from "./filtro-por-patente.pipe";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FiltroPorPatentePipe, FormsModule, RouterLink],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.css'
})
export class VehiculosComponent {

  patenteFiltro: string = ''; // Filtro de patente
  listcars: CarResponseDto[] = [];
  constructor(private adminservice: AdminService, private vehicleservice: VehicleService) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
this.cargartodoslosvehiculos();
  }


  cargartodoslosvehiculos(){
    this.adminservice.getAllVehicles().subscribe(
      (next) => { this.listcars = next },
      (error) => { console.log(error) }
    )
  }
  editarVehiculo(car: CarResponseDto): void {
    // Implementar la lógica para editar el vehículo, por ejemplo, abrir un modal de edición
    console.log('Editar vehículo', car);
  }


  eliminarVehiculo(car: CarResponseDto): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar el vehículo con patente ${car.patent}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleservice.deleteCar(car.idCar).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El vehículo ha sido eliminado correctamente.',
              confirmButtonText: 'Aceptar'
            });

            // Actualizar la lista de vehículos después de eliminar
            this.cargartodoslosvehiculos();
          },
          error: (err) => {
            console.error('Error al eliminar el vehículo:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al intentar eliminar el vehículo. Inténtelo de nuevo más tarde.',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }
}
