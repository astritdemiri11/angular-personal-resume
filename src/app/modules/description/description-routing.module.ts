import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DescriptionComponent } from './pages/description/description.component';
import { DescriptionResolver } from './pages/description/resolver/description.resolver';

const routes: Routes = [
  {
    path: '',
    component: DescriptionComponent,
    resolve: {
      home: DescriptionResolver
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
export class DescriptionRoutingModule { }
