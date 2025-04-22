import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoExitosoRoutingModule } from './pago-exitoso-routing.module';
import { PagoExitosoComponent } from './pago-exitoso.component';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    PagoExitosoComponent
  ],
  imports: [
    CommonModule,
    PagoExitosoRoutingModule,
    FormsModule,
    RecaptchaModule,
    
  ]
})
export class PagoExitosoModule { }
