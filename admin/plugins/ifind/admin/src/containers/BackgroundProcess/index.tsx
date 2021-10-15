import React, { FunctionComponent, useCallback, useEffect, useState, useRef } from "react";
import { Header } from "@buffetjs/custom";

import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import {
  BackgroundProcessProvider,
  useBackgroundProcess,
  I_BackgroundProcessProviderValues,
} from "../../providers/backgroundProcessProvider";

import LogsList from '../../components/LogsList';

import './styles.scss';

export type statusLabelMapType = {
  [key: string]: any
};

const BackgroundProcess = (): JSX.Element => {
  const { name, logs, refetch }: I_BackgroundProcessProviderValues = useBackgroundProcess()

  const statusLabelMap: statusLabelMapType = {
    STOP: 'Stopped',
    START: 'Running',
    ERROR: 'Stopped with Error',
  };

  const refetchData = useCallback(() => {
    refetch && refetch();
  }, [ refetch ]);

  useEffect(() => {
    window.setTimeout(() => refetchData(), 1000);
  }, [ logs ]);

  return (
    <div className="container">
      <div className="row">
        <Header title={{ label: name }} />
        <div className="background-process__logs">
          { logs?.length && (
            <LogsList logs={logs} />
          ) }
        </div>
      </div>
    </div>
  );
};

interface I_Props {
  [key: string]: any
}
export default (props: I_Props) => (
  <BackgroundProcessProvider>
    <BackgroundProcess {...props} />
  </BackgroundProcessProvider>
);
