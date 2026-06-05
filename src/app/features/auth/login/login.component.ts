import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    usuario: '',
    password: ''
  };
  
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.rol === 'Administrador') {
          this.router.navigate(['/admin/inventarios']);
        } else {
          this.router.navigate(['/inspector/codigo-inventario']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al iniciar sesión. Verifique sus credenciales.';
      }
    });
  }
}
