import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Reporte } from 'src/app/models/reporte';

@Injectable({
  providedIn: 'root',
})
export class ReporteAguaService {
  route = `${environment.apiUrl}/reporte-fugas`;
  private _refreshListReporteAgua$ = new Subject<Reporte | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  get refreshListComunidades() {
    return this._refreshListReporteAgua$;
  }

  post(dto: Reporte) {
    return this.http.post<Reporte>(`${this.route}/crear`, dto)
      .pipe(
        tap(() => {
          this._refreshListReporteAgua$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  getTotalReportes(): Observable<number> {
    return this.http.get<number>(`${this.route}/total-atendidos`);
  }

}
