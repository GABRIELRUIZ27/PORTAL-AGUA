import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigPaginator, Generos } from 'src/app/global/global';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PanelComponent,
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: 'CONFIG_PAGINATOR', useValue: ConfigPaginator },
    { provide: 'GENEROS', useValue: Generos }
  ],
  exports: [PanelComponent]
})
export class PanelModule { }
