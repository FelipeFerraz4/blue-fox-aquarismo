import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettaFish7CareTips } from './betta-fish-7-care-tips';

describe('BettaFish7CareTips', () => {
  let component: BettaFish7CareTips;
  let fixture: ComponentFixture<BettaFish7CareTips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettaFish7CareTips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BettaFish7CareTips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
