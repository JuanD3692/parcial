import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderComponent } from './lender.component';

describe('LenderComponent', () => {
  let component: LenderComponent;
  let fixture: ComponentFixture<LenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
