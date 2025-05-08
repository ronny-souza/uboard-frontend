export interface MilestoneModel {
  uuid: string;
  providerId: number;
  title: string;
  createdAt: Date;
  finishedAt: Date;
  synchronizedAt: Date;
  isAutoSync: boolean;
  frequency: string;
  hours: number;
  minutes: number;
  weekDay: number;
}
