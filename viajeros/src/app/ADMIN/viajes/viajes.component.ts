import { Component, OnInit } from '@angular/core';
import { ViajeDto } from '../../models/Admin/ViajeDto';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/Admin/admin.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css'
})
export class ViajesComponent implements OnInit {
  viajes: ViajeDto[] = [];  // Lista que contendrá todos los viajes
  filteredViajes: ViajeDto[] = [];  // Lista filtrada que se mostrará en la tabla
  estadoForm: FormGroup;  // Formulario para filtrar por estado
  searchText = '';  // Texto para la búsqueda general


  constructor(private formBuilder: FormBuilder, private adminService: AdminService) {
    this.estadoForm = this.formBuilder.group({
      estado: ['TODOS']  // Valor por defecto
    });
  }

  ngOnInit(): void {
    // Llamada inicial para obtener todos los viajes (sin filtro)
    this.obtenerViajes();
  }














  // Obtener viajes desde el servicio, con opción de filtrar por estado
  obtenerViajes(estado?: string): void {
    this.adminService.getViajes(estado).subscribe(
      (viajes: ViajeDto[]) => {
        this.viajes = viajes;
        console.log(viajes)
        this.filteredViajes = viajes;  // Inicialmente, muestra todos los viajes
      },
      (error) => {
        console.error('Error al obtener los viajes:', error);
      }
    );
  }

  // Filtra los viajes según el estado seleccionado
  filtrarPorEstado() {
    const estadoSeleccionado = this.estadoForm.get('estado')?.value;

    if (estadoSeleccionado) {
      this.filteredViajes = this.viajes.filter(viaje =>
        estadoSeleccionado === 'TODOS' || viaje.status === estadoSeleccionado
      );
    } else {
      this.filteredViajes = [...this.viajes];  // Si no hay estado seleccionado, muestra todos
    }
  }

  // Función para buscar en la tabla
  searchTable() {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredViajes = this.viajes.filter(viaje =>
      viaje.driverName.toLowerCase().includes(searchTextLower) ||
      viaje.passengers.some(passenger => passenger.toLowerCase().includes(searchTextLower)) ||
      viaje.origin.toLowerCase().includes(searchTextLower) ||
      viaje.destination.toLowerCase().includes(searchTextLower) ||
      this.formatDate(viaje.startDate).includes(searchTextLower)
    );
  }
  // Función para formatear la fecha
  formatDate(dateArray: any): string {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      // El array contiene [year, month, day, hour, minute], entonces reconstruimos la fecha
      const year = dateArray[0];
      const month = dateArray[1];  // Los meses en JavaScript van de 0 a 11, por lo que no es necesario restar 1
      const day = dateArray[2];

      // Creamos una instancia de Date con el año, mes y día
      const date = new Date(year, month - 1, day);  // Restar 1 al mes ya que en JavaScript los meses son de 0-11

      const formattedDay = String(date.getDate()).padStart(2, '0');
      const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');  // Sumamos 1 porque getMonth() devuelve de 0 a 11
      const formattedYear = date.getFullYear();

      return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    } else {
      return 'Fecha inválida';  // Devuelve un mensaje de error si el array no tiene los datos esperados
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CREATED':
        return 'Creado';
      case 'IN PROGRESS':
        return 'En Progreso';
      case 'CANCELED':
        return 'Cancelado';
      case 'FINISHED':
        return 'Finalizado';
      case 'DELETED':
        return 'Eliminado';
      default:
        return status;
    }
  }

}