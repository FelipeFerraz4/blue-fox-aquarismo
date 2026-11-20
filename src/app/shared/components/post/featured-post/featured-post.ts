import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../model/types/post';

@Component({
  selector: 'app-featured-post',
  standalone: true,
  imports: [LocalizePipe, TranslatePipe, RouterLink],
  templateUrl: './featured-post.html',
  styleUrl: './featured-post.scss',
})
export class FeaturedPost {
  @Input() featuredPosts: Post[] = [];
}
