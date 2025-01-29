import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { HasClaimDirective } from './directives/has-claim.directive';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@NgModule({
  declarations: [
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    PageHeaderComponent,
    NotFoundComponent,
    NoResultsComponent,
    HasClaimDirective,
  ],
  exports: [
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    PageHeaderComponent,
    NotFoundComponent,
    NoResultsComponent,
    HasClaimDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // Import FormsModule
  ]
})
export class SharedModule { }
