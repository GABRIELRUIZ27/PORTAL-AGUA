import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { Agua } from 'src/app/models/agua';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AguaService {
  route = `${environment.apiUrl}/agua-potable-public`;
  private _refreshListAgua$ = new Subject<Agua | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  get refreshListAgua() {
    return this._refreshListAgua$;
  }

  getByContrato(contrato: string): Observable<Agua> {
    return this.http.get<Agua>(`${this.route}/obtener-por-contrato/${contrato}`);
  }

  buscarPorNombre(nombre: string) {
    const url = `${this.route}/buscar-por-nombre?nombre=${encodeURIComponent(nombre)}`;
    return this.http.get<any>(url);
  }

  pagarConConekta(payload: { nombre: string; correo: string; totalEnPesos: number }) {
    return this.http.post<{ url: string }>(`${environment.apiUrl}/link-pago`, null, {
      params: {
        nombre: payload.nombre,
        correo: payload.correo,
        totalEnPesos: payload.totalEnPesos
      }
    });
  }
  
}
