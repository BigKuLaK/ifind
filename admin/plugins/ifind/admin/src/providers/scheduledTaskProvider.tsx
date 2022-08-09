import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { useGQLFetch } from "../helpers/gqlFetch";
import { post } from "../helpers/scripts-server/request";
import { useScriptsServerUrl } from "../providers/scheduledTasksListProvider";
import axios from "axios";

const scheduledTaskQuery = `
query GetScheduledTask ( $task: String! ) {
  getTask(id: $task ) {
    name
    logs {
      timestamp
      date_time
      type
      message
    }
    canRun
  }
}
`;

export const ScheduledTaskContext = createContext<ScheduledTaskContextData>({});

export const ScheduledTaskProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const gqlFetch = useGQLFetch();
  const getScriptsServerUrl = useScriptsServerUrl();
  const { taskID } = useParams<ScheduledTaskRouteParams>();
  const [task, setTask] = useState<Task>();

  const getTask = useCallback(async () => {
    axios.get(await getScriptsServerUrl(`/task/logs?task=${taskID}&after=`)).then(
      (response) => {
        response && setTask(response.data.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const updateTask = useCallback(async (taskID, newData) => {
    const data = await post(`/task/update?task=${taskID}`, newData);
    console.log({ updatedTask: data });
  }, [])

  const refetch = useCallback(() => {
    getTask();
  }, [getTask]);

  useEffect(() => {
    if (taskID) {
      getTask();
    }
  }, [taskID]);

  return (
    <ScheduledTaskContext.Provider value={{ task, updateTask, refetch }}>
      {children}
    </ScheduledTaskContext.Provider>
  );
};

export const useScheduledTask = () => useContext(ScheduledTaskContext);
