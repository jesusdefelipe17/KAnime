import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangaPerfilPage } from './manga-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: MangaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangaPerfilPageRoutingModule {}
