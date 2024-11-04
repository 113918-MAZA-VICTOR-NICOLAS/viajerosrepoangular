import { Component, ElementRef,ViewChild, OnInit } from '@angular/core';
import { PagoPasajeroDto } from '../../models/Admin/PagoPasajeroDto';
import { PaymentsService } from '../../services/payments.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-senas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './senas.component.html',
  styleUrl: './senas.component.css'
})
export class SenasComponent implements OnInit {

  paymentForm: FormGroup;


  pagos: PagoPasajeroDto[] = [];
  pagoPasajeroDto!: PagoPasajeroDto;
  requestDriverPaymentDto = {
    idPago: 0,
    estado: 'PENDIENTE',
    idTransferenciaChofer: 0
  };


  constructor(private pagoService: PaymentsService) {
    this.paymentForm = new FormGroup({
      estado: new FormControl('', Validators.required),
      idTransferenciaChofer: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarPagos();
  }

  selectPago(pago: PagoPasajeroDto) {
    this.pagoPasajeroDto = pago;
  }


  paidChofer(pago: PagoPasajeroDto) {
    this.pagoPasajeroDto = pago
  }
  cargarPagos(): void {
    this.pagoService.obtenerPagosPasajeros().subscribe({
      next: (pagos) => this.pagos = pagos,
      error: (error) => console.error('Error al obtener los pagos de pasajeros', error)
    });
  }

  actualizarPago() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const requestDriverPaymentDto = {
      idPago: this.pagoPasajeroDto.idPayment,
      estado: this.paymentForm.get('estado')?.value,
      idTransferenciaChofer: this.paymentForm.get('idTransferenciaChofer')?.value
    };

    this.pagoService.updateDriverPaymentStatus(requestDriverPaymentDto).subscribe(
      response => {
        // Alerta de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'Pago actualizado exitosamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.cargarPagos(); // Recargar la lista de pagos después de la alerta

    
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el pago',
          text: 'Hubo un problema al actualizar el pago. Inténtelo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al actualizar el pago:', error);
      }
    );
  }
}