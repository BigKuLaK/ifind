import React, { useEffect, useState } from "react";
import LogEntry from "./entry";
import { I_LogEntry } from '../../providers/backgroundProcessProvider';

import './styles.scss';

export type T_LogsListProps = {
  logs: I_LogEntry[]
};

const LogsList = ({ logs }: T_LogsListProps) => {
  const [ logsList, setLogsList ] = useState<I_LogEntry[]>([]);

  useEffect(() => {
    setLogsList([...logs.reverse()]);
  }, [ logs ]);

  return (
    <div className="logs">
      <h3 className="logs__heading">Logs</h3>
      <div className="logs__entries">
        {logsList?.length &&
          logsList.map((props: I_LogEntry) => (
            <LogEntry key={props.date_time + props.message} {...props} />
          ))}
      </div>
    </div>
  );
};

export default LogsList;
