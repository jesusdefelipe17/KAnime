import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimePerfilPage } from './anime-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: AnimePerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimePerfilPageRoutingModule {}
