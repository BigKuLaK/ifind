import React from "react";
import { I_LogEntry } from "../../providers/backgroundProcessProvider";

export interface LogEntryProps extends I_LogEntry {}

const formatLogMessage = (ansiMessage: string = "") =>
  ansiMessage.replace(/(\u001b\[\d+m)/gi, "");
const padType = (type: string = "") =>
  type?.padEnd(5, " ").substr(0, 7).replace(/\s/g, "&nbsp;");

const LogEntry = ({ date_time, type, message }: LogEntryProps): JSX.Element => {
  return (
    <div className="logs__entry">
      <div className="logs__entry-datetime">{date_time}</div>
      <div
        className="logs__entry-type"
        dangerouslySetInnerHTML={{ __html: padType(type as string) }}
      ></div>
      <div
        className="logs__entry-message"
        dangerouslySetInnerHTML={{
          __html: formatLogMessage(message as string | undefined),
        }}
      ></div>
    </div>
  );
};

export default LogEntry;
