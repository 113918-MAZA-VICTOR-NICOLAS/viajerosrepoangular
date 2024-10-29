import { Component, OnInit } from '@angular/core';
import { ReintegroService } from '../../services/reintegro.service';
import { ReintegroDto } from '../../models/Reintegro/ReintegroDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from '../../services/payments.service';
import { ResponsePaymentDto } from '../../models/Payments/ResponsePaymentDto';
import { UpdateReintegroDto } from '../../models/Reintegro/UpdateReintegroDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reintegros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reintegros.component.html',
  styleUrl: './reintegros.component.css'
})
export class ReintegrosComponent implements OnInit {
  reintegros: ReintegroDto[] = [];
  reintegroSeleccionado: ReintegroDto | null = null;

  reintegrosFiltrados: ReintegroDto[] = [];
  filtroEstado: string = '';
  payment: ResponsePaymentDto | null = null;
  error: string | null = null;
  idPaymentSelected: number = 0;

  paymentDto: ResponsePaymentDto | null = null;
  editStatus: string = '';
  editComments: string = '';

  updateDto: UpdateReintegroDto = {
    idReintegro: 0, // Establecer según lógica
    nuevoEstado: '',
    idAdministrador: 123 // Establecer según lógica, por ejemplo, id de sesión del usuario
  };


  constructor(private reintegroService: ReintegroService, private paymentService: PaymentsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadReintegros();
    this.filtrarPorEstado();

    this.route.params.subscribe(params => {
      const id = +params['id']; // El '+' convierte el parámetro de string a número
      if (id) {
        this.paymentService.getPaymentById(id).subscribe({
          next: (data) => this.payment = data,
          error: (err) => this.error = 'Error al cargar el pago: ' + err.message
        });
      }
    });
  }

  openEditModal(idPayment: number, reintegro: ReintegroDto) {
    this.paymentService.getPaymentById(idPayment).subscribe({
      next: (response) => {
        this.paymentDto = response;
        this.editStatus = this.paymentDto.status;
        this.editComments = ''; // Reset comments or fetch existing comments if necessary
      },
      error: (error) => {
        console.error('Failed to load payment details', error);
      }
    });
    this.reintegroSeleccionado = reintegro;

    this.idPaymentSelected = idPayment
  }

  submitUpdate(): void {
    if (this.reintegroSeleccionado) {
      this.updateDto.idReintegro = this.reintegroSeleccionado.idReintegro;
    }

    const idAdmin = localStorage.getItem('userId');
    if (idAdmin) {
      this.updateDto.idAdministrador = +idAdmin;
    }
console.log(this.updateDto)
    this.reintegroService.updateReintegro(this.updateDto).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Exito!',
          text: 'Reintegro actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        console.log('Reintegro actualizado correctamente:', response);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al actualizar el reintegro',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error al actualizar el reintegro:', error);
      }
    });
  }

  loadReintegros(): void {
    this.reintegroService.getAllReintegros().subscribe({
      next: (data) => {
        this.reintegros = data.map(reintegro => ({
          ...reintegro,
          // Utiliza el método convertToDate para convertir el arreglo a un objeto Date
          fechaReintegro: this.convertToDate(reintegro.fechaReintegro)
        }));
        this.filtrarPorEstado();
      },
      error: (error) => {
        console.error('Error al cargar los reintegros', error);
      }
    });
  }
  filtrarPorEstado(): void {
    if (!this.filtroEstado) {
      this.reintegrosFiltrados = this.reintegros;
    } else {
      this.reintegrosFiltrados = this.reintegros.filter(reintegro => reintegro.status === this.filtroEstado);
    }
  }

  translateStatus(status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'NULL': 'No Solicitado',
      'REQUIRED': 'Reintegro Solicitado',
      'RETURNED': 'Reintegro Completado',
      'REJECTED': 'Reintegro Rechazado'
    };
    return statusTranslations[status] || status;
  }

  translateMotivo(motivo: string): string {
    const motivoTranslations: { [key: string]: string } = {
      'DRIVER_REQUEST': 'Solicitado por el Chofer',
      'PASSENGER_CANCEL': 'Cancelado por el Pasajero'
    };
    return motivoTranslations[motivo] || motivo;
  }
  private convertToDate(dateArray: any): Date {
    if (Array.isArray(dateArray)) {
      return new Date(
        dateArray[0], // Año
        dateArray[1] - 1, // Mes
        dateArray[2], // Día
        dateArray[3] || 0, // Hora
        dateArray[4] || 0 // Minuto
      );
    }
    return dateArray; // Si ya es Date, lo devolvemos tal cual
  }


}