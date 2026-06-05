import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ActivoService } from '../../../services/activo.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { Activo } from '../../../core/models/activo.model';

/**
 * Componente para escanear códigos de barras con ZXing
 */
@Component({
  selector: 'app-escanear',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './escanear.component.html',
  styleUrls: ['./escanear.component.css']
})
export class EscanearComponent implements OnInit {
  scannerEnabled = signal<boolean>(false);
  scannerAvailable = signal<boolean>(false);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  activoEncontrado = signal<Activo | null>(null);

  // Para el scanner
  deviceCurrent: MediaDeviceInfo | undefined = undefined;
  devicesAvailable: MediaDeviceInfo[] = [];
  
  // Formatos soportados: códigos de barras lineales + QR + Data Matrix
  allowedFormats = [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.ITF,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ];

  constructor(
    private activoService: ActivoService,
    private inspectorState: InspectorStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que tenga un inventario activo
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
    }
  }

  /**
   * Iniciar el escáner de códigos de barras
   */
  iniciarScanner(): void {
    this.scannerEnabled.set(true);
    this.errorMessage.set('');
  }

  /**
   * Detener el escáner
   */
  detenerScanner(): void {
    this.scannerEnabled.set(false);
  }

  /**
   * Callback cuando se detecta un código de barras
   * Este método será llamado por el componente zxing-scanner
   */
  onCodigoEscaneado(codigo: string): void {
    if (!codigo || this.loading()) return;

    console.log('Código escaneado:', codigo);
    this.detenerScanner();
    this.buscarActivo(codigo);
  }

  /**
   * Buscar activo por código de barras
   */
  buscarActivo(barcode: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.activoService.porBarcode(barcode).subscribe({
      next: (activo) => {
        this.loading.set(false);
        this.activoEncontrado.set(activo);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'No se encontró ningún activo con este código de barras'
        );
      }
    });
  }

  /**
   * Enviar activo sin modificaciones
   */
  enviarActivo(): void {
    const activo = this.activoEncontrado();
    if (!activo) return;

    const inventarioId = this.inspectorState.getInventarioId();
    if (!inventarioId) {
      alert('No hay inventario activo. Valide el código de inventario primero.');
      return;
    }

    this.loading.set(true);

    const payload: Activo = {
      idActivo: activo.idActivo,
      etiqueta: activo.etiqueta,
      descripcion: activo.descripcion,
      marca: activo.marca,
      serial: activo.serial,
      modelo: activo.modelo,
      responsable: activo.responsable,
      ciudad: activo.ciudad,
      estado: activo.estado || 'Bueno',
      inventarioId,
    };

    this.activoService.crear(payload).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Activo registrado exitosamente');
        this.volver();
      },
      error: (error) => {
        this.loading.set(false);
        alert('Error al registrar activo: ' + (error.error?.message || error.message));
      }
    });
  }

  /**
   * Habilitar edición del activo
   */
  editarActivo(): void {
    const activo = this.activoEncontrado();
    if (!activo) return;

    // Navegar al formulario con los datos del activo
    this.router.navigate(['/inspector/activo'], {
      state: { activo, modoEdicion: true }
    });
  }

  /**
   * Intentar nuevamente (reiniciar scanner)
   */
  intentarNuevamente(): void {
    this.activoEncontrado.set(null);
    this.errorMessage.set('');
    this.iniciarScanner();
  }

  /**
   * Volver al menú principal
   */
  volver(): void {
    this.router.navigate(['/inspector/menu']);
  }

  /**
   * Callback cuando las cámaras están disponibles
   */
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.devicesAvailable = devices;
    this.scannerAvailable.set(devices && devices.length > 0);
    
    // Seleccionar la cámara trasera por defecto si está disponible
    const rearCamera = devices.find(device => 
      /back|rear|environment/gi.test(device.label)
    );
    
    this.deviceCurrent = rearCamera || devices[0] || undefined;
  }

  /**
   * Callback cuando hay un error de permisos
   */
  onPermissionResponse(granted: boolean): void {
    if (!granted) {
      this.errorMessage.set(
        'Se necesitan permisos de cámara para escanear códigos de barras'
      );
      this.scannerEnabled.set(false);
    }
  }

  /**
   * Cambiar entre cámaras disponibles
   */
  cambiarCamara(): void {
    const currentIndex = this.devicesAvailable.findIndex(
      device => device.deviceId === this.deviceCurrent?.deviceId
    );
    
    const nextIndex = (currentIndex + 1) % this.devicesAvailable.length;
    this.deviceCurrent = this.devicesAvailable[nextIndex];
  }
}
