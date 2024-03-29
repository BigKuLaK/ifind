declare interface TasksListProps {
  tasks: I_RawTask[];
  onTaskAction?: (action: string, taskID: string) => any;
}

declare interface AddTaskActionProps {
  task: I_RawTask;
}

declare interface TaskLogsLinkProps {
  task: string;
}
