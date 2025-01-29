import { Component } from '@angular/core';
import { AguaService } from 'src/app/core/services/agua-potable.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  contrato: string = '';
  nombre: string = '';
  domicilio: string = '';
  agua: any = null; // Información de contrato obtenida
  numeroContrato: string | null = null; // Número de contrato encontrado
  errorBuscar: string = ''; // Error para búsquedas
  errorNombreDomicilio: string = ''; // Error para búsqueda por nombre y domicilio
  errorPeriodo: string = ''; // Error para validación de periodo
  periodoPago: string = ''; // Periodo de pago ingresado por el usuario
  aguaCosto: string = '';
  alcantarilladoCosto: string = '';
  recargos: string = '';
  total: string = '';
  correo: string = '';
  showAlert: boolean = false;
  showErrorAlertContrato: boolean = false;
  showErrorAlertNombre: boolean = false;
  captchaResolved: boolean = false;

  constructor(private aguaService: AguaService,
    private mensajeService: MensajeService,
  ) {}

  // Método para buscar contrato por número
  buscarContrato() {
    if (!this.contrato) {
      this.errorBuscar = 'Por favor, ingresa un número de contrato.';
      this.showErrorAlertContrato = true;
      setTimeout(() => {
        this.showErrorAlertContrato = false;
      }, 5000); // Ocultar alerta después de 5 segundos
      return;
    }

    this.aguaService.getByContrato(this.contrato).subscribe({
      next: (data) => {
        this.agua = data;
        this.errorBuscar = '';
        this.showErrorAlertContrato = false; // Ocultar alerta de error si es exitosa
      },
      error: () => {
        this.errorBuscar =
          'No se encontró información con este número de contrato.';
        this.agua = null;
        this.showErrorAlertContrato = true; // Mostrar alerta de error
        setTimeout(() => {
          this.showErrorAlertContrato = false;
        }, 5000);
      },
    });
  }


// Método para buscar contrato por nombre
buscarContratoPorNombre() {
  if (!this.nombre) {
    this.errorNombreDomicilio = 'Por favor, ingresa el nombre completo.';
    this.showErrorAlertNombre = true;
    setTimeout(() => {
      this.showErrorAlertNombre = false;
    }, 5000);
    return;
  }

  this.aguaService.buscarPorNombre(this.nombre).subscribe({
    next: (data) => {
      this.numeroContrato = data?.contrato || 'No encontrado';
      this.errorNombreDomicilio = '';
      this.showErrorAlertNombre = false; // Ocultar alerta de error si es exitosa
    },
    error: () => {
      this.errorNombreDomicilio =
        'No se encontró un número de contrato con el nombre proporcionado.';
      this.numeroContrato = null;
      this.showErrorAlertNombre = true; // Mostrar alerta de error
      setTimeout(() => {
        this.showErrorAlertNombre = false;
      }, 5000);
    },
  });
}

  // Copiar número de contrato al portapapeles
 copiarContrato() {
    if (this.numeroContrato) {
      navigator.clipboard.writeText(this.numeroContrato).then(() => {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000); // Ocultar alerta después de 5 segundos
      });
    }
  }

  // Validar periodo de pago y calcular costos
  onPeriodoInput() {
    this.errorPeriodo = ''; // Limpiar cualquier error previo
  
    const ultimoPeriodo = this.agua?.periodo || '';
    const inicioUltimo = this.getFechaInicio(ultimoPeriodo);
    const finUltimo = this.getFechaFin(ultimoPeriodo);
    const inicioNuevo = this.getFechaInicio(this.periodoPago);
    const finNuevo = this.getFechaFin(this.periodoPago);
  
    // Verificar que las fechas sean válidas
    if (!inicioNuevo || !finNuevo || !finUltimo) {
      this.errorPeriodo = 'El período ingresado no es válido.';
      this.resetCostos();
      return;
    }
  
    // Calcular el mes siguiente al último período
    const mesSiguiente = new Date(finUltimo);
    mesSiguiente.setMonth(finUltimo.getMonth() + 1); // Avanzar un mes
  
    // Verificar si el primer mes del nuevo período es el mes siguiente al último período
    if (inicioNuevo.getMonth() !== mesSiguiente.getMonth() || inicioNuevo.getFullYear() !== mesSiguiente.getFullYear()) {
      this.errorPeriodo =
        'El período ingresado no puede saltarse meses del último período.';
      this.resetCostos();
      return;
    }
  
    // Calcular el número de meses entre el inicio y fin del nuevo período
    const meses = this.calcularMeses(inicioNuevo, finNuevo);
  
    // Asignar los costos basados en los meses calculados
    const costoAgua = meses * 65;
    const costoAlcantarillado = meses * 15;
    const costoTotal = costoAgua + costoAlcantarillado;
  
    // Asignamos los valores a las propiedades
    this.aguaCosto = `$${costoAgua}`;
    this.alcantarilladoCosto = `$${costoAlcantarillado}`;
  
    // Calcular recargos solo si el período está antes de 2025
    const añoNuevoPeriodo = inicioNuevo.getFullYear();
    if (añoNuevoPeriodo < 2025) {
      // Si el año es 2024 o antes, aplicar recargos del 10%
      const recargos = costoTotal * 0.1; // 10% de recargo
      this.recargos = `$${recargos.toFixed(2)}`;
      this.total = `$${(costoTotal + recargos).toFixed(2)}`;
    } else {
      // Si el período es después de 2024, no aplicar recargos
      this.recargos = `$0.00`;
      this.total = `$${costoTotal.toFixed(2)}`;
    }
  }
  
  // Métodos auxiliares para procesar fechas y calcular meses
  getFechaInicio(periodo: string): Date | null {
    const partes = periodo.split(' - ');
    if (partes.length === 2) {
      const mesInicio = this.convertirMesAIndice(partes[0].split(' ')[0]); // Convertir mes a número
      const añoInicio = partes[0].split(' ')[1]; // Año
      return mesInicio !== null ? new Date(Number(añoInicio), mesInicio, 1) : null;
    }
    return null;
  }
  
  getFechaFin(periodo: string): Date | null {
    const partes = periodo.split(' - ');
    if (partes.length === 2) {
      const mesFin = this.convertirMesAIndice(partes[1].split(' ')[0]); // Convertir mes a número
      const añoFin = partes[1].split(' ')[1]; // Año
      return mesFin !== null ? new Date(Number(añoFin), mesFin, 1) : null;
    }
    return null;
  }
  
// Método para convertir el nombre del mes a su índice correspondiente
convertirMesAIndice(mes: string): number | null {
  const meses: { [key: string]: number } = {
    Enero: 0, Febrero: 1, Marzo: 2, Abril: 3, Mayo: 4, Junio: 5,
    Julio: 6, Agosto: 7, Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11
  };
  return meses[mes] ?? null;  // Aquí se asegura de que mes sea una clave válida
}

  calcularMeses(inicio: Date, fin: Date): number {
    const inicioMes = inicio.getMonth();
    const finMes = fin.getMonth();
    const inicioAnio = inicio.getFullYear();
    const finAnio = fin.getFullYear();
    
    // Calculamos el número total de meses de diferencia
    return (finAnio - inicioAnio) * 12 + (finMes - inicioMes) + 1;
  }
  
  resetCostos() {
    this.aguaCosto = '';
    this.alcantarilladoCosto = '';
    this.total = '';
    this.recargos = '';
  }

  resetModal() {
    this.periodoPago = '';
    this.errorPeriodo = '';
    this.correo  = '';
    this.resetCostos();
  }

  pagar() {
    if (!this.periodoPago || this.errorPeriodo) {
      alert('Por favor, corrige los errores antes de proceder con el pago.');
      return;
    }

    alert(`Pago realizado con éxito para el período ${this.periodoPago}.
            Total: ${this.total}`);
    this.resetModal();
  }

  realizarNuevaConsulta() {
    this.agua = null;
    this.numeroContrato = null;
    this.errorBuscar = '';
    this.errorNombreDomicilio = '';
    this.contrato = '';
    this.nombre = '';
  }
  
  openEmail(event: MouseEvent): void {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      // Abre Gmail en escritorio
      window.open(
        'https://mail.google.com/mail/?view=cm&to=sistemasapetatitlan@gmail.com',
        '_blank'
      );
      event.preventDefault(); // Previene la apertura de `mailto:` en escritorio
    }
  }
  
  onCaptchaResolved(response: string | null): void {
    if (response) {
      this.captchaResolved = true;  // Habilita el botón de "Pagar"
    } else {
      this.captchaResolved = false;  // Si no hay respuesta, deshabilita el botón
    }
  }
  
}
