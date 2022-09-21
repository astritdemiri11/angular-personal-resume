import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { NodeProjectComponent } from './pages/node-project/node-project.component';
import { NodeProjectResolver } from './pages/node-project/resolver/node-project.resolver';
import { ProjectIndexComponent } from './pages/project-index/project-index.component';
import { ProjectItemComponent } from './pages/project-item/project-item.component';
import { ProjectItemResolver } from './pages/project-item/resolver/project-item.resolver';

const routes: Route[] = [
  {
    path: '',
    component: NodeProjectComponent,
    resolve: { projects: NodeProjectResolver },
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: ProjectIndexComponent
      },
      {
        path: ':project',
        component: ProjectItemComponent,
        resolve: { project: ProjectItemResolver }
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
export class NodeProjectRoutingModule { }
