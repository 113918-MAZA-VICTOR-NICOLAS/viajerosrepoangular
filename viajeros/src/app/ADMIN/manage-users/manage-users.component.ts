import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataDto } from '../../models/User/UserDataDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
changeUserRole() {
throw new Error('Method not implemented.');
}
  users: UserDataDto[] = [];
  filteredUsers: UserDataDto[] = [];
  filtroEstado: string = '';  // Variable para el filtro de estado (Activo/Inactivo)
  commentblock: string = '';

  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data)
        this.users = data;
        this.filteredUsers = data;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }

  filtrarPorEstado(): void {
    if (this.filtroEstado === '') {
      this.filteredUsers = this.users;
    } else {
      const estadoActivo = this.filtroEstado === 'true';
      this.filteredUsers = this.users.filter(user => user.deleted !== estadoActivo);
    }
  }



  editarUsuario(user: UserDataDto) {
    // Lógica para editar usuario
  }

  eliminarUsuario(user: UserDataDto) {
    // Lógica para eliminar usuario
  }

  verMascotas(user: UserDataDto) {
    // Lógica para ver las mascotas del usuario
  }

  verVehiculos(user: UserDataDto) {
    // Lógica para ver los vehículos del usuario
  }

  verValoraciones(user: UserDataDto) {
    // Lógica para ver las valoraciones del usuario
  }

  enviarMensaje(user: UserDataDto) {
    // Lógica para enviar un mensaje al usuario
  }

  resetearContrasena(user: UserDataDto) {
    // Lógica para resetear la contraseña del usuario
  }

  cambiarRol(user: UserDataDto) {
    // Lógica para cambiar el rol del usuario
  }

  bloquearUsuario(user: UserDataDto) {
    // Lógica para bloquear al usuario
  }
  blockUser() {
   console.log(this.blockUser)
  }

}