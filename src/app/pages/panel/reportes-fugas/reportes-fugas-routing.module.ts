import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesFugasComponent } from './reportes-fugas.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesFugasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesFugasRoutingModule { }
