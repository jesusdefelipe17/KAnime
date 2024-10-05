import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangaPerfilPageRoutingModule } from './manga-perfil-routing.module';

import { MangaPerfilPage } from './manga-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangaPerfilPageRoutingModule
  ],
  declarations: [MangaPerfilPage]
})
export class MangaPerfilPageModule {}
