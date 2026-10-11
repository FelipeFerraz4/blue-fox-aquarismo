import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePage } from './article-page';
import { SeoService } from '../../../../core/services/seo/seo-service';

describe('ArticlePage', () => {
  let component: ArticlePage;
  let fixture: ComponentFixture<ArticlePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlePage],
      providers: [
        {
          provide: SeoService,
          useValue: { updateMetadata: jest.fn() }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
