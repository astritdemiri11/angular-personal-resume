import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(module => module.HomeModule)
  },
  {
    path: 'why-this-website-is-special',
    loadChildren: () => import('./modules/description/description.module').then(module => module.DescriptionModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./modules/blog/blog.module').then(module => module.BlogModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./modules/not-found/not-found.module').then(module => module.NotFoundModule)
  },
  {
    path: 'ng-library',
    loadChildren: () => import('./modules/ng-library/ng-library.module').then(module => module.NgLibraryModule)
  },
  {
    path: 'node-project',
    loadChildren: () => import('./modules/node-project/node-project.module').then(module => module.NodeProjectModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
