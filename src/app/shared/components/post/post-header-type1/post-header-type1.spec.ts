import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostHeaderType1 } from './post-header-type1';

describe('PostHeaderType1', () => {
  let component: PostHeaderType1;
  let fixture: ComponentFixture<PostHeaderType1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostHeaderType1],
    }).compileComponents();

    fixture = TestBed.createComponent(PostHeaderType1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
