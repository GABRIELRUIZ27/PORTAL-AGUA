import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { AguaInicioRoutingModule } from './agua-inicio-routing.module';
import { AguaInicioComponent } from './agua-inicio.component';

@NgModule({
  declarations: [
    AguaInicioComponent
  ],
  imports: [
    CommonModule,
    AguaInicioRoutingModule,
    FormsModule,
    RecaptchaModule
  ]
})
export class AguaInicioModule { }
