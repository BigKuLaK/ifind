import React, {
  useCallback,
  ComponentProps
} from "react";
import { Header } from "@buffetjs/custom";
import { useHistory } from 'react-router-dom';

import pluginId from '../../pluginId';
import { useScheduledTasksList, ScheduledTasksListProvider } from '../../providers/scheduledTasksListProvider';
import TasksList from '../../components/TasksList';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';

import "./styles.scss";

const ScheduledTasks = () => {
  const { tasks, startTask, stopTask } = useScheduledTasksList();
  const history = useHistory();

  const onTaskAction = useCallback((action, taskID) => {
    switch ( action ) {
      case 'start':
        startTask(taskID);
        break;
      case 'stop':
        stopTask(taskID);
        break;
    }
  }, [ startTask, stopTask ]);

  return (
    <div className="container scheduled-tasks">
      <Header
        title={{ label: "Scheduled Tasks" }}
      />
      <TasksList tasks={tasks} onTaskAction={onTaskAction} />
    </div>
  );
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks  {...props} />
  </ScheduledTasksListProvider>
);
