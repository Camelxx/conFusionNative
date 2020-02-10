import { Component, OnInit, Inject ,ViewContainerRef  } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';

import { FavoriteService } from '../services/favorite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Toasty } from 'nativescript-toasty';
import { action } from 'tns-core-modules/ui/dialogs/dialogs';

import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { CommentComponent } from '~/comment/comment.component';

@Component({
  selector: 'app-dishdetail',
    moduleId: module.id,
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  commentHeight: number;

  dish: Dish;
  comment: Comment;
  errMess: string;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private favoriteservice: FavoriteService,
    private fonticon: TNSFontIconService,
    private vcRef: ViewContainerRef,
    private modalService: ModalDialogService,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {

    this.route.params
    .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { 
        this.dish = dish;
        this.favorite = this.favoriteservice.isFavorite(this.dish.id);
        this.updateCommentsInfo();        
      },
      errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

  addToFavorites() {
    if (!this.favorite) {
      console.log('Adding to Favorites', this.dish.id);
      this.favorite = this.favoriteservice.addFavorite(this.dish.id);
      const toast = new Toasty("Added Dish "+ this.dish.id, "short", "bottom");
      toast.show();
    }
  }

  goBack(): void {
    this.routerExtensions.back();
  }

  openDialog() {
    let options = {
        title: "Actions available",
        message: "Select an option",
        cancelButtonText: "Cancel",
        actions: ["Add to favorites", "Add comment"]
    };
    action(options).then((result) => {
      if (result == 'Add to favorites') {
        this.addToFavorites();
      }
      if (result == 'Add comment') {
        this.openCommentModal();
      }
    });
  }
  
  openCommentModal() {
    console.log('Opening modal');
    let options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: 'comment',
      fullscreen: false
    };

    this.modalService.showModal(CommentComponent, options)
      .then((comment: Comment) => {
         if (comment) {
          this.dish.comments.push(comment);
          this.updateCommentsInfo();
         } 
      });
  }

  updateCommentsInfo() {
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach((comment: Comment) => total += comment.rating);
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

}