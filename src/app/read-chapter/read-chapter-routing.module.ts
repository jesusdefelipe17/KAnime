import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadChapterPage } from './read-chapter.page';

const routes: Routes = [
  {
    path: '',
    component: ReadChapterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadChapterPageRoutingModule {}
