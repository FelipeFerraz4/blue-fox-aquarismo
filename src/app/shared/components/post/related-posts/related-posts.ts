import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { Post } from '../../../model/types/post';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-related-posts',
  standalone: true,
  imports: [LocalizePipe, LocalDatePipe, TranslatePipe, RouterLink],
  templateUrl: './related-posts.html',
  styleUrl: './related-posts.scss',
})
export class RelatedPosts {
  @Input() recommendedPosts: Post[] = [];
  @Input() lastPosts: Post[] = [];
}
