import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/api/auth/login'; // Cambia por la URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  // Guardar el token en el local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener el token desde el local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  // Obtener el id del usuario desde el local storage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Obtener el nombre del usuario desde el local storage
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
  // Eliminar los datos de sesión (logout)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('rol');
  }


  // Guardar el token, id y nombre en el local storage
  saveSessionData(token: string, id: string, name: string, rol: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('userName', name);
    localStorage.setItem('rol', rol);
  }
}
