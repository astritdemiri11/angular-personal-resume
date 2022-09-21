import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ArrangementModule } from 'ngx-arrangement';
import { SharedModule } from 'src/app/shared/shared.module';

import { DescriptionRoutingModule } from './description-routing.module';
import { DescriptionComponent } from './pages/description/description.component';

const materialModules = [
  FlexLayoutModule
];

@NgModule({
  declarations: [
    DescriptionComponent
  ],
  imports: [
    ArrangementModule,
    DescriptionRoutingModule,
    materialModules,
    SharedModule
  ]
})
export class DescriptionModule { }
