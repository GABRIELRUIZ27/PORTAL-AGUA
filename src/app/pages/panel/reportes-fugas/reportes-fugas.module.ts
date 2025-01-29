import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReportesFugasComponent } from './reportes-fugas.component';
import { ReportesFugasRoutingModule } from './reportes-fugas-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ReportesFugasComponent
  ],
  imports: [
    CommonModule,
    ReportesFugasRoutingModule,
    FormsModule,
    RecaptchaModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class ReportesFugasModule { }
