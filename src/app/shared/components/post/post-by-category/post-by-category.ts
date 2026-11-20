import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryWithPost } from '../../../model/types/category';

@Component({
  selector: 'app-post-by-category',
  standalone: true,
  imports: [LocalDatePipe, TranslatePipe, RouterLink],
  templateUrl: './post-by-category.html',
  styleUrl: './post-by-category.scss',
})
export class PostByCategory {
  @Input() categoryWithPost: CategoryWithPost[] = [];
}
