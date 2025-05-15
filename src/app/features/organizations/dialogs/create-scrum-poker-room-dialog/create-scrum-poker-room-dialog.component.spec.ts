import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScrumPokerRoomDialogComponent } from './create-scrum-poker-room-dialog.component';

describe('CreateScrumPokerRoomDialogComponent', () => {
  let component: CreateScrumPokerRoomDialogComponent;
  let fixture: ComponentFixture<CreateScrumPokerRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateScrumPokerRoomDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScrumPokerRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
