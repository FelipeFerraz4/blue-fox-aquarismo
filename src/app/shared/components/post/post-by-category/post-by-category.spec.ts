import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostByCategory } from './post-by-category';

describe('PostByCategory', () => {
  let component: PostByCategory;
  let fixture: ComponentFixture<PostByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostByCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostByCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
