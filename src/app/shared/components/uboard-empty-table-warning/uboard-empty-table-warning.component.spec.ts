import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardEmptyTableWarningComponent } from './uboard-empty-table-warning.component';

describe('UboardEmptyTableWarningComponent', () => {
  let component: UboardEmptyTableWarningComponent;
  let fixture: ComponentFixture<UboardEmptyTableWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardEmptyTableWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardEmptyTableWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
