import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadManwhaChapterPage } from './read-manwha-chapter.page';

const routes: Routes = [
  {
    path: '',
    component: ReadManwhaChapterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadManwhaChapterPageRoutingModule {}
