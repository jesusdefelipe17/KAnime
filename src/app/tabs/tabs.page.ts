import { Component } from '@angular/core';
import { BaseDatosService } from '../services/base-datos.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { usuario } from '../interfaces/usuario';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

 
  constructor(private router: Router) {}

  ngOnInit(): void {
  
    
  }

  navigateTo(tab: string) {
    this.router.navigate([tab]);
  }

}
