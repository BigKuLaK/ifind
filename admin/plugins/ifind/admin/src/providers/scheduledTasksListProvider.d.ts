declare interface I_LogEntry {
  date_time: string;
  type: string;
  message: string;
}

declare interface I_ScheduledTaskRouteParam {
  scheduledTask: string;
}

declare interface I_ScheduledTaskContextValues {
  name?: string;
  logs?: Array<I_LogEntry | never>;
  start?: () => void;
  stop?: () => void;
  refetch?: () => void;
}

declare interface I_RawTask extends Partial<ScheduledTask> {
  last_run: string;
}

declare interface I_QueueItem {
  id: string;
  requestedForStart: boolean;
  running: boolean;
  canRun: boolean;
  task: I_RawTask;
  busy: boolean;
}

declare interface I_ScheduledTasksProviderValue {
  tasks?: I_RawTask[];
  isTaskAdded?: I_RawTask[];
  queue?: I_QueueItem[];
  startTask?: (taskId: string) => any;
  stopTask?: (taskId: string) => any;
  serverTimeUnix?: number | string;
  serverTimeFormatted?: string;
  limit?: number | string;
  parallel?: number | String;
  logs?: I_LogEntry[];
  error?: string;
  full?: boolean;
}

declare interface I_ComponentProps {
  children: any;
}

declare interface Task {
  frequency: string;
  id: string;
  name: string;
  next_run: number;
  status: string;
}
