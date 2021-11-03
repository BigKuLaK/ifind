import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { useGQLFetch } from "../helpers/gqlFetch";

// Context
export const ScheduledTasksListContext = createContext({});

export const tasksListsQuery = `
query {
  scheduledTasksList {
    id
    name
    status
    frequency
    next_run
    hasModule
  }
}
`;

export const triggerTaskQuery = `
mutation TriggerTask (
  $taskID: String
  $action: SCHEDULED_TASK_ACTION
) {
  triggerTask(
    taskID: $taskID
    action: $action
  ) {
    id
    name
    status
    frequency
    next_run
    hasModule
  }
}
`;

// Provider
export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const refetchFlag = useRef(false);
  const gqlFetch = useGQLFetch();
  const [tasks, setTasks] = useState<I_RawTask[]>([]);

  // Continuously called for realtime update
  const fetchTasksList = useCallback(async () => {
    await Promise.all([
      gqlFetch(tasksListsQuery).then((data) => {
        if (data?.scheduledTasksList) {
          setTasks(data.scheduledTasksList);
        }
      }).catch(err => err),
      new Promise(resolve => setTimeout(resolve, 1000)),
    ]);

    if ( refetchFlag.current ) {
      fetchTasksList();
    }
  }, [tasksListsQuery, gqlFetch, refetchFlag]);

  const triggerTask = useCallback(
    (taskID, action) => {
      gqlFetch(triggerTaskQuery, {
        taskID,
        action,
      });
    },
    [useGQLFetch]
  );

  const startTask = useCallback((taskID) => {
    triggerTask(taskID, "start");
  }, []);

  const stopTask = useCallback((taskID) => {
    triggerTask(taskID, "stop");
  }, []);

  useEffect(() => {
    refetchFlag.current = true;
    fetchTasksList();

    return () => {
      refetchFlag.current = false;
    }
  }, [ refetchFlag ]);

  return (
    <ScheduledTasksListContext.Provider value={{ tasks, startTask, stopTask }}>
      {children}
    </ScheduledTasksListContext.Provider>
  );
};

export const useScheduledTasksList = () => useContext(ScheduledTasksListContext);
