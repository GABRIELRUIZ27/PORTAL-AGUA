import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';

const routes: Routes = [
  {
    path: '', component: PanelComponent,
    children: [
      {
        path: '', redirectTo: 'inicio', pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadChildren: () => import('./portal/portal.module')
          .then(i => i.PortalModule)
      },
      {
        path: 'agua-potable',
        loadChildren: () => import('./agua-inicio/agua-inicio.module')
          .then(i => i.AguaInicioModule)
      },
      {
        path: 'pago-agua',
        loadChildren: () => import('./inicio/inicio.module')
          .then(i => i.InicioModule)
      },
      {
        path: 'reportes-fugas',
        loadChildren: () => import('./reportes-fugas/reportes-fugas.module')
          .then(i => i.ReportesFugasModule)
      },
      {
        path: 'tramites-agua',
        loadChildren: () => import('./tramites-agua/tramites-agua.module')
          .then(i => i.TramitesAguaModule)
      },
      {
        path: 'pago-exitoso',
        loadChildren: () => import('./pago-exitoso/pago-exitoso.module')
          .then(i => i.PagoExitosoModule)
      },
      {
        path: 'ecologia',
        loadChildren: () => import('./ecologia/ecologia.module')
          .then(i => i.EcologiaModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }