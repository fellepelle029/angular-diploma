import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BlogRoutingModule} from './blog-routing.module';
import {BlogComponent} from './blog/blog.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    BlogComponent
  ],
  imports: [
    CommonModule,

    SharedModule,
    BlogRoutingModule,
  ]
})
export class BlogModule {
}
