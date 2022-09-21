import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { BlogIndexComponent } from './pages/blog-index/blog-index.component';
import { BlogItemComponent } from './pages/blog-item/blog-item.component';
import { BlogItemResolver } from './pages/blog-item/resolver/blog-item.resolver';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogResolver } from './pages/blog/resolver/blog.resolver';

const routes: Route[] = [
  {
    path: '',
    component: BlogComponent,
    resolve: { blogs: BlogResolver },
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: BlogIndexComponent
      },
      {
        path: ':blog',
        component: BlogItemComponent,
        resolve: { blog: BlogItemResolver }
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
export class BlogRoutingModule { }
