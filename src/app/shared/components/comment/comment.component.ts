import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionType} from "../../../../types/comment-action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnChanges {

  @Input() comment!: CommentType;
  @Input() likedComments!: CommentActionType[];
  @Input() dislikedComments!: CommentActionType[];

  isLiked: boolean = false;
  isDisliked: boolean = false;


  constructor(private commentService: CommentService,
              private _snackbar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.isLiked = this.likedComments.some((action: CommentActionType) => action.comment === this.comment.id);
    this.isDisliked = this.dislikedComments.some((action: CommentActionType) => action.comment === this.comment.id);
  }


  applyAction(commentId: string, action: 'like' | 'dislike'): void {
    this.commentService.applyAction(commentId, action)
      .subscribe(
        () => {
          if (action === 'like') {
            this.handleLikeAction();
          } else if (action === 'dislike') {
            this.handleDislikeAction();
          }
        },
        (error) => {
          throw new Error(error);
        }
      );
  }

  violate(commentId: string, action: 'violate'): void {
    this.commentService.applyAction(commentId, action).subscribe(
      (result: DefaultResponseType) => {
        if (result) {
          this._snackbar.open('Жалоба отправлена');
        }
      },
      (error) => {
        this._snackbar.open(error.error.message);
      }
    );
  }


  private handleLikeAction(): void {
    if (!this.isLiked) {
      this.isLiked = true;
      this.comment.likesCount++;
      if (this.isDisliked) {
        this.comment.dislikesCount--;
        this.isDisliked = false;
      }
    } else {
      this.isLiked = false;
      this.comment.likesCount--;
    }
  }

  private handleDislikeAction(): void {
    if (!this.isDisliked) {
      this.isDisliked = true;
      this.comment.dislikesCount++;
      if (this.isLiked) {
        this.comment.likesCount--;
        this.isLiked = false;
      }
    } else {
      this.isDisliked = false;
      this.comment.dislikesCount--;
    }
  }
}
