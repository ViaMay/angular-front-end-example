import { Post } from '../../../../core/interfaces/post';
import { PostsService } from 'src/app/core/services/posts.service';
import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'author', 'tags', 'dateCreateAt', 'categoryId', 'actions'];

  public page: number;
  public pageSize = 10;
  public collectionSize: number;
  dataSource: Post [] = [];
  dataSourcePage: Post [] = [];

  constructor(
    private readonly router: Router,
    private readonly postsService: PostsService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.page = 1;
  }

  ngOnInit(): void {
    this.postsService.find().pipe(
      delay(1000)
    ).subscribe(
      (posts: Post[]) => {
        this.dataSource = posts;
        this.collectionSize = this.dataSource.length;
        this.dataSourcePage = posts.filter((post, i) => i < this.pageSize);
      }
    );
  }

  remove(id: string): void {
    this.postsService.remove(id).subscribe(() => {
      this.dataSource = this.dataSource.filter((post: Post) => post.id !== id);

      // Recalculate pagination after removing the post
      const startIndex = this.pageSize * (this.page - 1);
      this.dataSourcePage = this.dataSource.slice(startIndex, startIndex + this.pageSize);

      this.cdr.detectChanges(); // Trigger change detection
    });
  }


  onPageChanged(pageNumber: number): void  {
    console.log( pageNumber);
    this.page = pageNumber;
    this.dataSourcePage = this.dataSource.filter((post, i) => i < this.pageSize * pageNumber && i >=
      this.pageSize * (pageNumber - 1));
  }
}
