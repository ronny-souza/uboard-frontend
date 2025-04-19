import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardButtonWithIconComponent } from './uboard-button-with-icon.component';

describe('UboardButtonWithIconComponent', () => {
  let component: UboardButtonWithIconComponent;
  let fixture: ComponentFixture<UboardButtonWithIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardButtonWithIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardButtonWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
