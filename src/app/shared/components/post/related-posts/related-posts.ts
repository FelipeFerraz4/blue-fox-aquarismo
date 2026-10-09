import { Component, Input } from '@angular/core';
import { Post } from '../../../model/types/post';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-related-posts',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './related-posts.html',
  styleUrl: './related-posts.scss',
})
export class RelatedPosts {
  @Input() recommendedPosts: Post[] = [];
  @Input() lastPosts: Post[] = [];
}
