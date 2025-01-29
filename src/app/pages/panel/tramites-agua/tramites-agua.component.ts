import { Component } from '@angular/core';

@Component({
  selector: 'app-tramites-agua',
  templateUrl: './tramites-agua.component.html',
  styleUrls: ['./tramites-agua.component.css']
})
export class TramitesAguaComponent {
  activeTab = 1; 
  activePago = 1;

  setActiveTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  setActivePagoTab(tabIndex: number) {
    this.activePago = tabIndex;
  }
}
