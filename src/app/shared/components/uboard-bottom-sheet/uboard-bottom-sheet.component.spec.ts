import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardBottomSheetComponent } from './uboard-bottom-sheet.component';

describe('UboardBottomSheetComponent', () => {
  let component: UboardBottomSheetComponent;
  let fixture: ComponentFixture<UboardBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
