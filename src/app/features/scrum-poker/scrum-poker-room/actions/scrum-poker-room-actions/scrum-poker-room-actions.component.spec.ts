import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumPokerRoomActionsComponent } from './scrum-poker-room-actions.component';

describe('ScrumPokerRoomActionsComponent', () => {
  let component: ScrumPokerRoomActionsComponent;
  let fixture: ComponentFixture<ScrumPokerRoomActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumPokerRoomActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumPokerRoomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
