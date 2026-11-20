import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { NavbarSearch } from '../navbar-search/navbar-search';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslatePipe, RouterModule, NavbarSearch, LanguageSwitcher],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected auth = inject(AuthService);

  menuOpen = false;
  artigosOpen = false;
  ferramentasOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (!this.menuOpen) {
      this.artigosOpen = false;
      this.ferramentasOpen = false;
    }
  }

  toggleArtigos() {
    if (this.artigosOpen) {
      this.artigosOpen = false;
    } else {
      this.artigosOpen = true;
      this.ferramentasOpen = false;
    }
  }

  toggleFerramentas() {
    if (this.ferramentasOpen) {
      this.ferramentasOpen = false;
    } else {
      this.ferramentasOpen = true;
      this.artigosOpen = false;
    }
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
