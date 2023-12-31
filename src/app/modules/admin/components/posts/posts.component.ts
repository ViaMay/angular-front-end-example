import { Post } from '../../../../core/interfaces/post';
import { PostsService } from 'src/app/core/services/posts.service';
import { Component, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs/operators';

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
    private readonly postsService: PostsService
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
    this.postsService.remove(id).pipe(
      tap(() => {
          this.dataSource = this.dataSource.filter((post: Post) => post.id !== id);
          this.dataSourcePage = this.dataSource.filter((post, i) => i < this.pageSize * this.page && i >=
            this.pageSize * (this.page - 1));
        }
      )
    ).subscribe();
  }

  onPageChanged(pageNumber: number): void  {
    console.log( pageNumber);
    this.page = pageNumber;
    this.dataSourcePage = this.dataSource.filter((post, i) => i < this.pageSize * pageNumber && i >=
      this.pageSize * (pageNumber - 1));
  }
}
