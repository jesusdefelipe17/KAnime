import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadManwhaChapterPageRoutingModule } from './read-manwha-chapter-routing.module';

import { ReadManwhaChapterPage } from './read-manwha-chapter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadManwhaChapterPageRoutingModule
  ],
  declarations: [ReadManwhaChapterPage]
})
export class ReadManwhaChapterPageModule {}
