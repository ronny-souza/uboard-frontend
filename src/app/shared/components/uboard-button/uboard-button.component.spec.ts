import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardButtonComponent } from './uboard-button.component';

describe('UboardButtonComponent', () => {
  let component: UboardButtonComponent;
  let fixture: ComponentFixture<UboardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
