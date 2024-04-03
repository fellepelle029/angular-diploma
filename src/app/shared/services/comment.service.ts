import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable, Observer} from "rxjs";
import {CommentPostType} from "../../../types/comment-post.type";
import {AuthService} from "./auth.service";
import {CommentType} from "../../../types/comment.type";
import {CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  constructor(private http: HttpClient,
              private authService: AuthService,) { }


  postComment(commentInfo: CommentPostType): Observable<DefaultResponseType> {
    const accessToken = this.authService.getTokens().accessToken;
    const headers = new HttpHeaders({
      'x-auth': accessToken ? accessToken : ''
    });
    return this.http.post<DefaultResponseType>( environment.api + 'comments', commentInfo, {headers})
  }


  getComments(offset: number, articleId: string): Observable<{allCount:number, comments:CommentType[]|[]} | DefaultResponseType> {
    return this.http.get<{allCount:number, comments:CommentType[]|[]} | DefaultResponseType>(environment.api + 'comments?' + 'offset=' + offset + '&article=' + articleId);
  }


  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<DefaultResponseType> {
    const tokens = this.authService.getTokens();
    if (!tokens || !tokens.accessToken) {
      throw new Error('Access token not found');
    }

    const headers = new HttpHeaders({
      'x-auth': tokens.accessToken
    });
    const body = {
      action: action
    };
    return this.http.post<DefaultResponseType>(`http://localhost:3000/api/comments/${commentId}/apply-action`, body, { headers });
  }

  getActionsForComment(commentId: string): Observable<CommentActionType[] | DefaultResponseType> {
    const tokens = this.authService.getTokens();
    if (!tokens || !tokens.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders({
      'x-auth': tokens.accessToken
    });
    return this.http.get<CommentActionType[] | DefaultResponseType >(`http://localhost:3000/api/comments/${commentId}/actions`, {headers});
  }

  getArticleCommentsActions(articleId: string): Observable<CommentActionType[] | DefaultResponseType > {
    const tokens = this.authService.getTokens();
    if (!tokens || !tokens.accessToken) {
      throw new Error('Access token not found');
    }
    const headers = new HttpHeaders({
      'x-auth': tokens.accessToken
    });

    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + `comments/article-comment-actions?articleId=${articleId}`, {headers});
  }

}
