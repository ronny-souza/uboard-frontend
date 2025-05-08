import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizeOrganizationMilestoneDialogComponent } from './synchronize-organization-milestone-dialog.component';

describe('SynchronizeOrganizationMilestoneDialogComponent', () => {
  let component: SynchronizeOrganizationMilestoneDialogComponent;
  let fixture: ComponentFixture<SynchronizeOrganizationMilestoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizeOrganizationMilestoneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynchronizeOrganizationMilestoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
