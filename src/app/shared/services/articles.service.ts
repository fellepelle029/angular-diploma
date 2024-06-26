import { Injectable } from '@angular/core';
import {ArticlesType} from "../../../types/articles.type";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {FullArticlesResponseType} from "../../../types/full-articles-response.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http:HttpClient) { }

  getPopularArticles():Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api + 'articles/top');
  }

  getArticles(): Observable<FullArticlesResponseType> {
    return this.http.get<{count: number, pages: number, items: ArticlesType[]}>(environment.api + 'articles');
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api + 'articles/related/' + url);
  }

}
