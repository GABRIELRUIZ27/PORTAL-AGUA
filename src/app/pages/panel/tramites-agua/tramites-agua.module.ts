import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TramitesAguaComponent } from './tramites-agua.component';
import { TramitesAguaRoutingModule } from './tramites-agua-routing.module';


@NgModule({
  declarations: [
    TramitesAguaComponent
  ],
  imports: [
    CommonModule,
    TramitesAguaRoutingModule,
    FormsModule,
    RecaptchaModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class TramitesAguaModule { }
