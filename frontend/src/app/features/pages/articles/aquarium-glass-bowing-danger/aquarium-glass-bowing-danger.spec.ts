import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { AquariumGlassBowingDanger } from './aquarium-glass-bowing-danger';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

describe('AquariumGlassBowingDanger', () => {
  let component: AquariumGlassBowingDanger;
  let fixture: ComponentFixture<AquariumGlassBowingDanger>;

  const mockSeoService = {
    updateMetadata: jest.fn()
  };

  const mockPostService = {
    getPostPageData: jest.fn().mockReturnValue({
      post: {
        title: 'Test',
        description: 'Test desc',
        image: 'img.png',
        slug: 'test'
      },
      recommended: [],
      latest: []
    })
  };

  beforeEach(async () => {
    (global as any).IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }));

    await TestBed.configureTestingModule({
      imports: [AquariumGlassBowingDanger],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
        { provide: PostService, useValue: mockPostService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AquariumGlassBowingDanger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});