import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-header-type1',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-header-type1.html',
  styleUrl: './post-header-type1.scss',
})
export class PostHeaderType1 {
  @Input() title = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() author = 'Equipe Blue Fox';
  @Input() date = '';
  @Input() readingTime = '5 min';
  @Input() category = 'Guia de Montagem';
}