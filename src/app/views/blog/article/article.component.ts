import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {Location} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: ArticleType | null = null;
  articleText: string = '';
  serverStaticPath: string = environment.serverStaticPath;
  relatedArticles: ArticlesType[] = [];

  isLogged: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private location: Location,
              private authService: AuthService)
  { this.isLogged = this.authService.isLoggedIn(); }

  ngOnInit(): void {
    this.loadArticle();
    this.loadRelatedArticles();
  }


  loadArticle() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.articlesService.getArticle(params['url'])
          .subscribe((article: ArticleType) => {
            if (article as ArticleType) {
              this.article = article;
              this.articleText = article.text;
              console.log(this.article);
            }
          });
      });
  }

  loadRelatedArticles() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((relatedArticle: ArticlesType[]) => {
            this.relatedArticles = relatedArticle;
            console.log(this.relatedArticles);
          });
      });
  }


  back() {
    this.location.back();
  }

}
