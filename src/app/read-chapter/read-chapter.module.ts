import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadChapterPageRoutingModule } from './read-chapter-routing.module';

import { ReadChapterPage } from './read-chapter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadChapterPageRoutingModule
  ],
  declarations: [ReadChapterPage]
})
export class ReadChapterPageModule {}
