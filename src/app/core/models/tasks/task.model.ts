import { TaskStatusEnum } from './task-status.enum';

export interface Task {
  uuid: string;
  operation: string;
  status: TaskStatusEnum;
  detail: string;
  progress: number;
  createdAt: Date;
  finishedAt: Date;
}
