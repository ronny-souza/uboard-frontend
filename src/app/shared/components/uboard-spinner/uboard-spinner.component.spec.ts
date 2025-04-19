import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardSpinnerComponent } from './uboard-spinner.component';

describe('UboardSpinnerComponent', () => {
  let component: UboardSpinnerComponent;
  let fixture: ComponentFixture<UboardSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
