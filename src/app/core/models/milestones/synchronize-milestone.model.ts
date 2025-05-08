import { UnsynchronizedMilestoneModel } from './unsynchronized-milestone.model';

export interface SynchronizeMilestoneModel {
  organization: string;
  milestone: UnsynchronizedMilestoneModel;
  isAutoSync: boolean;
  isImporting: boolean;
  frequency: string;
  hours?: number;
  minutes?: number;
  weekDay?: number;
  time?: Date;
}
