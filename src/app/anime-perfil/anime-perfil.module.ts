import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimePerfilPageRoutingModule } from './anime-perfil-routing.module';

import { AnimePerfilPage } from './anime-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimePerfilPageRoutingModule
  ],
  declarations: [AnimePerfilPage]
})
export class AnimePerfilPageModule {}
