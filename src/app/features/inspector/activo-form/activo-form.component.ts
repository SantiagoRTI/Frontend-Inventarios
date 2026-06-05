import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivoService } from '../../../services/activo.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { Activo } from '../../../core/models/activo.model';

@Component({
  selector: 'app-activo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activo-form.component.html',
  styleUrls: ['./activo-form.component.css']
})
export class ActivoFormComponent implements OnInit {
  activoForm!: FormGroup;
  loading = signal<boolean>(false);
  modoEdicion = false;
  tituloFormulario = 'Registrar Activo';

  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private inspectorState: InspectorStateService,
    private router: Router
  ) {
    // Verificar que tenga un inventario activo
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
    }
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatosRecibidos();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  inicializarFormulario(): void {
    this.activoForm = this.fb.group({
      idActivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      etiqueta: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      serial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      responsable: ['', [Validators.maxLength(150)]],
      ciudad: ['', [Validators.maxLength(100)]],
      estado: ['Bueno']
    });
  }

  /**
   * Carga datos si vienen desde Escanear o Digitar
   */
  cargarDatosRecibidos(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || (window.history.state as any);

    if (state && state.activo) {
      const activo: Activo = state.activo;
      this.modoEdicion = state.modoEdicion || false;

      // Llenar formulario con los datos
      this.activoForm.patchValue({
        idActivo: activo.idActivo || '',
        etiqueta: activo.etiqueta || '',
        descripcion: activo.descripcion || '',
        marca: activo.marca || '',
        serial: activo.serial || '',
        modelo: activo.modelo || '',
        responsable: activo.responsable || '',
        ciudad: activo.ciudad || '',
        estado: activo.estado || 'Bueno'
      });

      // Si es modo edición, bloquear idActivo
      if (this.modoEdicion && activo.idActivo) {
        this.activoForm.get('idActivo')?.disable();
        this.tituloFormulario = 'Editar Activo';
      }
    }
  }

  /**
   * Guardar activo (crear)
   */
  guardarActivo(): void {
    if (this.activoForm.invalid) {
      this.marcarCamposComoTocados();
      alert('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    this.loading.set(true);

    // Obtener valores del formulario
    let formValues = this.activoForm.getRawValue(); // getRawValue() incluye campos deshabilitados
    
    // Agregar inventarioId
    const inventarioId = this.inspectorState.getInventarioId();
    const activo: any = {
      ...formValues,
      inventarioId: inventarioId
    };

    this.activoService.crear(activo).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Activo registrado exitosamente');
        this.router.navigate(['/inspector/menu']);
      },
      error: (error) => {
        this.loading.set(false);
        const mensaje = error.error?.message || error.message || 'Error al registrar activo';
        alert('Error: ' + mensaje);
      }
    });
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  marcarCamposComoTocados(): void {
    Object.keys(this.activoForm.controls).forEach(key => {
      const control = this.activoForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo es inválido y fue tocado
   */
  campoInvalido(campo: string): boolean {
    const control = this.activoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  obtenerError(campo: string): string {
    const control = this.activoForm.get(campo);
    
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Cancelar y volver al menú
   */
  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los datos ingresados.')) {
      this.router.navigate(['/inspector/menu']);
    }
  }

  /**
   * Volver al menú
   */
  volver(): void {
    this.router.navigate(['/inspector/menu']);
  }
}
