import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UboardPageTitleComponent } from './uboard-page-title.component';

describe('UboardPageTitleComponent', () => {
  let component: UboardPageTitleComponent;
  let fixture: ComponentFixture<UboardPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UboardPageTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UboardPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
