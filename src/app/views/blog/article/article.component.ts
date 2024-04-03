import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {Location} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommentPostType} from "../../../../types/comment-post.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentType} from "../../../../types/comment.type";
import {CommentActionType} from "../../../../types/comment-action.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: ArticleType | null = null;
  articleId: string = ''
  articleText: string = '';
  serverStaticPath: string = environment.serverStaticPath;
  relatedArticles: ArticlesType[] = [];

  isLogged: boolean = false;

  commentForm!: FormGroup;
  comments: CommentType[] = [];
  offset: number = 0;
  showLoadMoreButton: boolean = false;

  likedComments: CommentActionType[] = [];
  dislikedComments: CommentActionType[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService,
              private location: Location,
              private authService: AuthService,
              private fb: FormBuilder,
              private _snackbar: MatSnackBar,
              private router: Router,
              private commentService: CommentService,) {
    this.isLogged = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.loadArticle();
    this.loadRelatedArticles();
    this.loadComments();

    this.commentForm = this.fb.group({
      text: ['', Validators.required],
      article: [this.articleId],
    });
  }

  loadArticle() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.offset = 0;
        this.articlesService.getArticle(params['url'])
          .subscribe((article: ArticleType) => {
              if (article as ArticleType) {
                this.article = article;
                this.articleText = article.text;
                this.articleId = article.id;
              }
            },
            (error) => {
            this.router.navigate(['']);
            this._snackbar.open('Ошибка при загрузке статьи.');
            });
      });
  }

  loadRelatedArticles() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.articlesService.getRelatedArticles(params['url'])
          .subscribe((relatedArticle: ArticlesType[]) => {
            this.relatedArticles = relatedArticle;
          });
      });
  }

  loadComments() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.articlesService.getArticle(params['url']).subscribe((article: ArticleType) => {
        if (article) {
          this.offset = 0;
          this.articleId = article.id;
          this.commentService.getComments(this.offset, this.articleId)
            .subscribe((response: { allCount: number, comments: CommentType[] } | DefaultResponseType) => {
              if ('comments' in response) {
                this.comments = response.comments.slice(0, 3);
                this.showLoadMoreButton = this.comments.length < response.allCount;
                this.commentService.getArticleCommentsActions(this.articleId)
                  .subscribe((result: CommentActionType[] | DefaultResponseType) => {
                      if (Array.isArray(result) && (result as CommentActionType[])) {
                        this.likedComments = result.filter((action: CommentActionType) => action.action === 'like');
                        this.dislikedComments = result.filter((action: CommentActionType) => action.action === 'dislike');
                      }
                    },
                    (error) => {
                      throw new Error(error)
                    });
              }
            });
        }
      });
    });
  }

  loadMoreComments() {
    if (this.offset === 0) {
      this.offset += 3;
    } else {
      this.offset += 10;
    }

    this.commentService.getComments(this.offset, this.articleId)
      .subscribe((response: { allCount: number, comments: CommentType[] } | DefaultResponseType) => {
        if ('comments' in response) {
          this.comments = [...this.comments, ...response.comments];
          this.showLoadMoreButton = this.comments.length < response.allCount;
        }
      });
  }

  postComment() {
    if (this.commentForm.valid) {
      const commentInfo: CommentPostType = {
        text: this.commentForm.get('text')?.value,
        article: this.articleId
      };
      this.commentService.postComment(commentInfo)
        .subscribe((response: DefaultResponseType) => {
          this._snackbar.open(response.message);
          this.commentForm.reset();
          this.loadComments();
        }, (error) => {
          this._snackbar.open(error);
          throw new Error(error);
        });
    }
  }


  back() {
    this.location.back();
  }
}
