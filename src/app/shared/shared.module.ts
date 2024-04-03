import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import {TruncateHeaderPipe} from "./pipes/truncate-header.pipe";
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
  declarations: [
    BlogCardComponent,
    TruncatePipe,
    TruncateHeaderPipe,
    CommentComponent,
  ],
  exports: [
    BlogCardComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ]
})
export class SharedModule {
}
