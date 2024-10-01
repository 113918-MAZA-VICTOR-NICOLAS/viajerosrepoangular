import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewTripRequestDto } from '../models/Viajes/NewTripRequestDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private readonly apiUrl = 'http://localhost:8080/api/viajes';  // Cambiar a la URL correcta

  constructor(private http: HttpClient) {}

  // Método para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Asegúrate de que sea JSON
    });
  }

  // Método para registrar un viaje
  registerTrip(newTrip: NewTripRequestDto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/register`, newTrip, { headers });
  }

}
