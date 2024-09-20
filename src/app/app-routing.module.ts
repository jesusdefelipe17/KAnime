import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'pagina-pelicula/:id',
    loadChildren: () => import('./pagina-pelicula/pagina-pelicula.module').then( m => m.PaginaPeliculaPageModule)
  },
  {
    path: 'pagina-serie/:id',
    loadChildren: () => import('./pagina-serie/pagina-serie.module').then( m => m.PaginaSeriePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'anime-perfil/:id',
    loadChildren: () => import('./anime-perfil/anime-perfil.module').then( m => m.AnimePerfilPageModule)
  },  {
    path: 'video-modal',
    loadChildren: () => import('./video-modal/video-modal.module').then( m => m.VideoModalPageModule)
  },
  {
    path: 'video-player',
    loadChildren: () => import('./video-player/video-player.module').then( m => m.VideoPlayerPageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    IonicModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
