import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AguaInicioComponent } from './agua-inicio.component';

const routes: Routes = [
  {
    path: '',
    component: AguaInicioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AguaInicioRoutingModule { }
