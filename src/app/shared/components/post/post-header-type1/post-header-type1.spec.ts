import { provideTestTranslations } from '../../../../core/i18n/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostHeaderType1 } from './post-header-type1';

describe('PostHeaderType1', () => {
  let component: PostHeaderType1;
  let fixture: ComponentFixture<PostHeaderType1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTestTranslations()],
      imports: [PostHeaderType1],
    }).compileComponents();

    fixture = TestBed.createComponent(PostHeaderType1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the title in the language the API returned (untranslated posts stay pt-BR)', () => {
    fixture.componentRef.setInput('title', 'Peixe Betta');
    fixture.componentRef.setInput('contentLang', 'pt-BR');
    fixture.detectChanges();
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Peixe Betta');
    expect(h1.getAttribute('lang')).toBe('pt-BR');
  });
});
