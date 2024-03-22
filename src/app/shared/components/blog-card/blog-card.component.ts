import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {ArticlesType} from "../../../../types/articles.type";
import {ArticlesService} from "../../services/articles.service";

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent implements OnInit {

  serverStaticPath = environment.serverStaticPath;
  @Input() article!: ArticlesType;


  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {


  }


}
