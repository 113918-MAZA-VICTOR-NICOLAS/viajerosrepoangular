import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDto } from '../models/Payments/PaymentsDto';
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private apiUrl = 'http://localhost:8080/api/register-payment'; // URL del endpoint

  constructor(private http: HttpClient) { }

  // Método para registrar el pago
  registerPayment(paymentDto: PaymentDto): Observable<any> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Configurar los headers con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Hacer la solicitud HTTP POST al backend
    return this.http.post<any>(this.apiUrl, paymentDto, { headers , responseType: 'text' as 'json' });
  }
}
