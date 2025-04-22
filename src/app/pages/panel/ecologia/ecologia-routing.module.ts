import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcologiaComponent } from './ecologia.component';

const routes: Routes = [
  {
    path: '',
    component: EcologiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcologiaRoutingModule { }
