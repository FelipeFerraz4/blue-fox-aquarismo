import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-header-type1',
  standalone: true,
  imports: [LocalDatePipe, TranslatePipe],
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
  /** Idioma do título/descrição/categoria (`post.locale`): pode diferir da página se faltar tradução. */
  @Input() contentLang?: string;
}