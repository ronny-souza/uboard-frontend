import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumPokerRoomComponent } from './scrum-poker-room.component';

describe('ScrumPokerRoomComponent', () => {
  let component: ScrumPokerRoomComponent;
  let fixture: ComponentFixture<ScrumPokerRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumPokerRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumPokerRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
