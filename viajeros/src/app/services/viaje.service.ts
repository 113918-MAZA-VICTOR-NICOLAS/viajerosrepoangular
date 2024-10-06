import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewTripRequestDto } from '../models/Viajes/NewTripRequestDto';
import { Observable } from 'rxjs';
import { ViajesRequestMatchDto } from '../models/Viajes/ViajesRequestMatchDto';
import { SearchResultMatchDto } from '../models/Viajes/SearchResultMatchDto';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  private readonly apiUrl = 'http://localhost:8080/api/viajes';  // Cambiar a la URL correcta

  constructor(private http: HttpClient) { }
  listresultorigin!: SearchResultMatchDto[]
  // Método para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'  // Asegúrate de que sea JSON
    });
  }
  setResultadosBusqueda(response: SearchResultMatchDto[]) {
    this.listresultorigin = response
  }
  // Método para registrar un viaje
  // Método para registrar un viaje
  registerTrip(newTrip: NewTripRequestDto): Observable<string> {
    const headers = this.getAuthHeaders();  // Método para obtener los headers con autenticación
    return this.http.post<string>(`${this.apiUrl}/register`, newTrip, {
      headers,
      responseType: 'text' as 'json'  // Indica que esperas texto como respuesta
    });
  }
  buscarViajes(viajesRequestMatchDto: ViajesRequestMatchDto): Observable<SearchResultMatchDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.post<SearchResultMatchDto[]>(`${this.apiUrl}/buscar`, viajesRequestMatchDto, {
      headers  // Indica que esperas texto como respuesta
    });
  }
}
