import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManwhaPerfilPage } from './manwha-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: ManwhaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManwhaPerfilPageRoutingModule {}
