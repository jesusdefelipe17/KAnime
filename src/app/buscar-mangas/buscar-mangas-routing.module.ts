import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscarMangasPage } from './buscar-mangas.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarMangasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscarMangasPageRoutingModule {}
