import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ImageCarousel } from './image-carousel';
import { CarouselSlide } from '../../../model/types/carousel-slide';

describe('ImageCarousel', () => {
  let component: ImageCarousel;
  let fixture: ComponentFixture<ImageCarousel>;

  const mockSlides: CarouselSlide[] = [
    {
      id: 1,
      image: 'test1.webp',
      title: 'Slide 1',
      description: 'Desc 1',
      button: { text: 'Btn 1', link: '/test1' }
    },
    {
      id: 2,
      image: 'test2.webp',
      title: 'Slide 2',
      description: 'Desc 2',
      button: { text: 'Btn 2', link: '/test2' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCarousel],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCarousel);
    component = fixture.componentInstance;
    component.slides = mockSlides;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should advance to next slide on next()', () => {
    expect(component.currentIndex()).toBe(0);
    component.next();
    expect(component.currentIndex()).toBe(1);
    component.next();
    expect(component.currentIndex()).toBe(0);
  });

  it('should go to previous slide on prev()', () => {
    expect(component.currentIndex()).toBe(0);
    component.prev();
    expect(component.currentIndex()).toBe(1);
  });

  it('should go to specified index on goTo()', () => {
    component.goTo(1);
    expect(component.currentIndex()).toBe(1);
  });

  it('should pause and resume autoplay state', () => {
    component.pause();
    expect(component.isPaused).toBe(true);
    component.resume();
    expect(component.isPaused).toBe(false);
  });
});
