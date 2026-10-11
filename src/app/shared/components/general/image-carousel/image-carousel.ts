import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  HostListener,
  signal,
  NgZone
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselSlide } from '../../../model/types/carousel-slide';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-carousel.html',
  styleUrl: './image-carousel.scss',
})
export class ImageCarousel implements OnInit, OnDestroy {
  @Input() slides: CarouselSlide[] = [];
  @Input() autoplay: boolean = true;
  @Input() interval: number = 5000;

  currentIndex = signal<number>(0);
  isPaused = false;

  private isBrowser: boolean;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;
  private touchEndX = 0;
  private touchStartY = 0;
  private touchEndY = 0;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.autoplay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(): void {
    if (this.slides.length === 0) return;
    const nextIndex = (this.currentIndex() + 1) % this.slides.length;
    this.currentIndex.set(nextIndex);
    this.cdr.markForCheck();
  }

  prev(): void {
    if (this.slides.length === 0) return;
    const prevIndex = (this.currentIndex() - 1 + this.slides.length) % this.slides.length;
    this.currentIndex.set(prevIndex);
    this.cdr.markForCheck();
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex.set(index);
      this.restartAutoplay();
      this.cdr.markForCheck();
    }
  }

  pause(): void {
    this.isPaused = true;
    this.stopAutoplay();
  }

  resume(): void {
    this.isPaused = false;
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    if (!this.isBrowser || this.slides.length <= 1) return;

    // Executa fora da zona do Angular para não impedir ApplicationRef.isStable() (hidratação SSR)
    this.ngZone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        if (!this.isPaused) {
          this.ngZone.run(() => {
            this.next();
          });
        }
      }, this.interval);
    });
  }

  private stopAutoplay(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private restartAutoplay(): void {
    if (this.autoplay && !this.isPaused) {
      this.startAutoplay();
    }
  }

  // Teclado
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.next();
      this.restartAutoplay();
    } else if (event.key === 'ArrowLeft') {
      this.prev();
      this.restartAutoplay();
    }
  }

  // Touch Swipe para mobile
  onTouchStart(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      this.touchStartX = event.changedTouches[0].clientX;
      this.touchStartY = event.changedTouches[0].clientY;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      this.touchEndX = event.changedTouches[0].clientX;
      this.touchEndY = event.changedTouches[0].clientY;
      this.handleSwipe();
    }
  }

  private handleSwipe(): void {
    const threshold = 40; // pixels mínimos para swipe horizontal
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    // Apenas dispara se o gesto for predominantemente horizontal,
    // evitando conflito com a rolagem vertical natural da página no mobile
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.next(); // swipe para a esquerda -> próximo
      } else {
        this.prev(); // swipe para a direita -> anterior
      }
      this.restartAutoplay();
    }
  }
}
