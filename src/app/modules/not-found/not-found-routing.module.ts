import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NotFoundResolver } from './pages/not-found/resolvers/not-found.resolver';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    resolve: {
      notFound: NotFoundResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class NotFoundRoutingModule { }
