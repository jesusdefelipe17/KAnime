import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManwhaPerfilPageRoutingModule } from './manwha-perfil-routing.module';

import { ManwhaPerfilPage } from './manwha-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManwhaPerfilPageRoutingModule
  ],
  declarations: [ManwhaPerfilPage]
})
export class ManwhaPerfilPageModule {}
