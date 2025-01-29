import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramitesAguaComponent } from './tramites-agua.component';

const routes: Routes = [
  {
    path: '',
    component: TramitesAguaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesAguaRoutingModule { }
