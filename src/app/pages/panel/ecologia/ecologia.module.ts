import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { EcologiaComponent } from './ecologia.component';
import { EcologiaRoutingModule } from './ecologia-routing.module';

@NgModule({
  declarations: [
    EcologiaComponent
  ],
  imports: [
    CommonModule,
    EcologiaRoutingModule,
    FormsModule,
    RecaptchaModule,
    
  ]
})
export class EcologiaModule { }
