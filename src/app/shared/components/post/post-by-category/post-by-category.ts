import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryWithPost } from '../../../model/types/category';

@Component({
  selector: 'app-post-by-category',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './post-by-category.html',
  styleUrl: './post-by-category.scss',
})
export class PostByCategory {
  @Input() categoryWithPost: CategoryWithPost[] = [];
}
