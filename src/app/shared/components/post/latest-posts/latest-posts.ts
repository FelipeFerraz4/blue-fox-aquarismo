import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../model/types/post';

@Component({
  selector: 'app-latest-posts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './latest-posts.html',
  styleUrl: './latest-posts.scss',
})
export class LatestPosts {
  @Input() latestPosts: Post[] = [];
}
