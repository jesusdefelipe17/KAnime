import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscarMangasPageRoutingModule } from './buscar-mangas-routing.module';

import { BuscarMangasPage } from './buscar-mangas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuscarMangasPageRoutingModule
  ],
  declarations: [BuscarMangasPage]
})
export class BuscarMangasPageModule {}
