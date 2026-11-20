import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../model/types/post';

@Component({
  selector: 'app-latest-posts',
  standalone: true,
  imports: [LocalizePipe, LocalDatePipe, TranslatePipe, RouterLink],
  templateUrl: './latest-posts.html',
  styleUrl: './latest-posts.scss',
})
export class LatestPosts {
  @Input() latestPosts: Post[] = [];
}
