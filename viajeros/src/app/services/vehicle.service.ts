import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NewCarRequestDto } from '../models/Vehicle/NewCarRequestDto';
import { CarResponseDto } from '../models/Vehicle/CarResponseDto';
import Swal from 'sweetalert2';
import { UserService } from './user.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {


  private apiUrl = 'http://localhost:8080/api/vehicle';  // Cambiar a la URL correcta

  constructor(private http: HttpClient, private loginService: LoginService) { }

  carForEdit!: CarResponseDto;
  setCarForEdit(carResponseDto: CarResponseDto) {
    this.carForEdit = carResponseDto;
  }

  getCarForEdit() {
    return this.carForEdit;
  }

  registerNewVehicle(newVehicle: NewCarRequestDto): Observable<CarResponseDto> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');

    if (!token || !id) {
      Swal.fire("Error", "Token o ID de usuario no encontrado.", "error");
      return throwError(() => new Error('Token o ID de usuario no encontrado.'));
    }

    newVehicle.userId = parseInt(id, 10);


    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.post<CarResponseDto>(`${this.apiUrl}/register`, newVehicle, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al registrar el vehículo', error);
          Swal.fire("Error", "Hubo un problema al registrar el vehículo", "error");
          return throwError(() => error);
        })
      );


  }


  getAllcars() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');

    if (!token || !id) {
      Swal.fire("Error", "Token o ID de usuario no encontrado.", "error");
      return throwError(() => new Error('Token o ID de usuario no encontrado.'));
    }
   
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<CarResponseDto[]>(`${this.apiUrl}/userVehicles/${id}`, { headers }) // Cambiar a Array
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los vehículos del usuario', error); // Cambiar el mensaje de error
          Swal.fire("Error", "Hubo un problema al obtener los vehículos del usuario", "error");
          return throwError(() => error);
        })
      );
  }
  deleteCar(idCar: number) {

    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.delete<CarResponseDto>(`${this.apiUrl}/delete/${idCar}`, { headers })
  }

}

