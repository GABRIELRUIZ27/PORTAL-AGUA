import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoExitosoComponent } from './pago-exitoso.component';

const routes: Routes = [
  {
    path: '',
    component: PagoExitosoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoExitosoRoutingModule { }
