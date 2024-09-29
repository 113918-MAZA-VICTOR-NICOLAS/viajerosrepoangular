import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, Routes } from '@angular/router';
import { UserService } from '../services/user.service';
import { passwordValidator } from '../validators/password.validator';
import { NewUserDto } from '../models/NewUserDto';
import Swal from 'sweetalert2';
import { RegisterComprobationDto } from '../models/RegisterComprobationDto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  NewUserDto = new NewUserDto();
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      passwordConfirm: ['', [Validators.required]],
      phone: ['', Validators.required]
    });
  }
 
  checkPasswords() {
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;
    return password === passwordConfirm;
  }

  loadNewUser() {
    if (!this.checkPasswords()) {
      console.error('Las contraseñas no coinciden.');
      return;
    }

    const newUserData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      phone: Number(this.registerForm.get('phone')?.value) // Asegúrate de que sea un número
    };

  
    this.userService.registerNewUser(newUserData).subscribe(
      (response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registrado",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/home']);
      }, (error) => {
        const registerComprobationDto: RegisterComprobationDto = error.error;

        if(registerComprobationDto.mailAlreadyExist){
          Swal.fire({
            icon: "error",
            title: "Correo ya existente",
            footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
          });
        }else if(registerComprobationDto.phoneAlreadyExist){
          Swal.fire({
            icon: "error",
            title: "Telefono ya existente",
            footer: '<a href="/passRecovery">¿Olvidaste tu contraseña?</a>'
          });
        }
   
    });

  }
}
