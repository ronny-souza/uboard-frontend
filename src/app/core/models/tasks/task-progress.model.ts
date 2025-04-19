import { TaskStatusEnum } from './task-status.enum';

export interface TaskProgress {
  status: TaskStatusEnum;
  progress: number;
}
