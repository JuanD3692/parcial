import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolModulesComponent } from './rol-modules.component';

describe('RolModulesComponent', () => {
  let component: RolModulesComponent;
  let fixture: ComponentFixture<RolModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolModulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
