import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedPosts } from './related-posts';

describe('RelatedPosts', () => {
  let component: RelatedPosts;
  let fixture: ComponentFixture<RelatedPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedPosts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
