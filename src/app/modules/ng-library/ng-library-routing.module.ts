import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LibraryIndexComponent } from './pages/library-index/library-index.component';
import { LibraryItemComponent } from './pages/library-item/library-item.component';
import { LibraryItemResolver } from './pages/library-item/resolver/library-item.resolver';
import { NgLibraryComponent } from './pages/ng-library/ng-library.component';
import { NgLibraryResolver } from './pages/ng-library/resolver/ng-library.resolver';

const routes: Route[] = [
  {
    path: '',
    component: NgLibraryComponent,
    resolve: { libraries: NgLibraryResolver },
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: LibraryIndexComponent
      },
      {
        path: ':library',
        component: LibraryItemComponent,
        resolve: { library: LibraryItemResolver }
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NgLibraryRoutingModule { }
