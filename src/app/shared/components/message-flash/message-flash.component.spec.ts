import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFlashComponent } from './message-flash.component';

describe('MessageFlashComponent', () => {
  let component: MessageFlashComponent;
  let fixture: ComponentFixture<MessageFlashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFlashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFlashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
