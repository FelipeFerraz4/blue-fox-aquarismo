import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LocalizePipe, TranslatePipe, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
}
