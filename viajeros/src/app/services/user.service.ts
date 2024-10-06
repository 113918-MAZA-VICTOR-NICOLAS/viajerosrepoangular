import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NewUserDto } from '../models/NewUserDto';
import { EditProfileResponseDto } from '../models/User/EditProfileResponseDto';
import { UpdateUserRequestDto } from '../models/UpdateUserRequestDto';
import Swal from 'sweetalert2';
import { UserDataDto } from '../models/User/UserDataDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'http://localhost:8080/api/user'; // Cambia por la URL de tu backend

  constructor(private http: HttpClient) { }

  registerNewUser(newuserdata: NewUserDto): Observable<any> {
    return this.http.post(this.apiUrl + '/register', newuserdata);
  }


  userRecovery(mail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recovery-mail?identifier=${encodeURIComponent(mail)}`, {});
  }
  resetPassword(token: string | null, newPassword: string): Observable<string> {
    const body = {
      password: newPassword, // Asegúrate de que "password" sea la propiedad esperada
      // Puedes agregar más propiedades si tu esquema lo requiere
    };
    return this.http.post(`${this.apiUrl}/reset-password?token=${token}`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' // Indica que esperas texto plano en lugar de JSON
    });




  }


  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  getUserDataById(): Observable<UserDataDto> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    if (!token) {
      return throwError(() => new Error('Token no encontrado.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserDataDto>(`${this.apiUrl}/dataUser/${id}`, { headers });
  }
  getUserData(): Observable<EditProfileResponseDto> {

    const token = localStorage.getItem('token'); // Obtén el token desde el localStorage

    const id = localStorage.getItem('userId');
    // Verifica si el token está presente
    if (!token) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('No token found')); // Lanza un error si no hay token
    }

    // Crea un objeto HttpHeaders y añade el header Authorization usando set
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`); // Usa set para agregar el header

    // Realiza la solicitud GET con el header
    return this.http.get<any>(`${this.apiUrl}/getuserdata/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching user for edit', error);
        return throwError(() => error); // Lanza el error
      })
    );

  }
  getUserForEdit(id: number): Observable<EditProfileResponseDto> {
    const token = localStorage.getItem('token'); // Obtén el token desde el localStorage

    // Verifica si el token está presente
    if (!token) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('No token found')); // Lanza un error si no hay token
    }

    // Crea un objeto HttpHeaders y añade el header Authorization usando set
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`); // Usa set para agregar el header

    // Realiza la solicitud GET con el header
    return this.http.get<any>(`${this.apiUrl}/edit/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching user for edit', error);
        return throwError(() => error); // Lanza el error
      })
    );
  }



  updateUser(id: number, updateUserRequestDto: UpdateUserRequestDto): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token
    if (!token) {
      console.error('Token no encontrado. Asegúrate de haber iniciado sesión.');
      return throwError(() => new Error('Token no encontrado.'));
    }

    return new Observable((observer) => {
      // Mostrar confirmación con SweetAlert
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podras revertir los cambios!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar!"
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, procede con la actualización
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`); // Usa set para agregar el header
          this.http.put(`${this.apiUrl}/update/${id}`, updateUserRequestDto, { headers, responseType: 'text' }).pipe(
            catchError((error) => {
              console.error('Error al actualizar el usuario', error);
              Swal.fire("Error", "Hubo un problema al actualizar el usuario", "error");
              return throwError(() => error); // Lanza el error
            })
          ).subscribe({
            next: (response) => {
              Swal.fire("Actualizado!", "El usuario ha sido actualizado correctamente.", "success");
              observer.next(response); // Emitir el éxito
              observer.complete();

            },
            error: (error) => {
              observer.error(error); // Emitir el error
            }
          });
        } else {
          // Si el usuario cancela, no hacer nada
          observer.complete();
        }
      });
    });
  }









}
