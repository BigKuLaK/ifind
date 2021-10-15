/**
 * NOTE
 * Discontinued due to unable to connect on nginx server
 * Needs further exploration
 * 
 * 
 * useWebSockets hook
 * 
 * USAGE:
 * 
 * 1. Define the actionHandlers
 * const actionHandlers = {
 *  'task-list': someFunctionToHandlePayload
 *  'other-action': someFunctionToHandleOtherPayload
 * }
 * 
 * 2. Call the hook, supplying the websocket URL and action handlers
 * useWebSockets( URL, actionHandlers);
 */

import { useCallback, useEffect, useState } from "react";

// Types
export type T_SendCallbackParam = any;
export type T_SendCallback = (action: string, payload?: T_SendCallbackParam) => void;
export type T_ActionHandlerCallback = (payload: any) => any;
export interface I_ActionHandlers {
  [action: string]: T_ActionHandlerCallback
}
export type I_UseWebSocket = (
  path: string,
  actionHandlers: I_ActionHandlers
) => [
  send: (action: string, payload?: any ) => any,
  socket: WebSocket|null,
];

// Hook
export const useWebSocket: I_UseWebSocket = (
  path,
  actionHandlers = {},
) => {
  const [ socket, setSocket ] = useState<WebSocket|null>(null);
  const [ isSocketOpen, setIsSocketOpen ] = useState(false);

  const send = useCallback<T_SendCallback>((action, payload = {}) => {
    const jsonString = JSON.stringify({
      action,
      payload
    });

    if ( isSocketOpen ) {
      socket?.send(jsonString);
    } else {
      socket?.addEventListener('open', () => {
        socket.send(jsonString);
      });
    }
  }, [ socket as WebSocket, isSocketOpen as boolean ]);

  const onMessage = useCallback((messageEvent) => {
    const messageData = JSON.parse(messageEvent.data);
    const { action, payload } = messageData;

    if ( typeof actionHandlers[action] === 'function' ) {
      actionHandlers[action](payload);
    }
  }, [ actionHandlers ]);

  const onSocketOpen = useCallback((socket) => {
    setSocket(socket);
  }, []);

  const connect = useCallback(() => {
    const socketProtocol: string = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const port: string = window.location.port ? `:${window.location.port}` : '';
    const sanitizedPath: string = '/ws/' + path.replace(/^\/+/, '');
    const socketURL: string = socketProtocol + '//' + window.location.hostname + port + sanitizedPath;
    const socket = new WebSocket(socketURL);

    socket.onclose = () => {
      setIsSocketOpen(false);
      console.log('WS Connection closed. Reconnecting...');
      setTimeout(connect, 3000);
    }

    socket.onopen = () => onSocketOpen(socket);

    // Applying message lister
    socket.onmessage = msgEvent => onMessage(msgEvent);
  }, [ path, onSocketOpen, onMessage ]);

  useEffect(() => {
    if ( socket?.OPEN ) {
      setIsSocketOpen(true);
    }
  }, [ socket ]);

  useEffect(() => {
    connect();
  }, [ path ]);

  return [
    send,
    socket
  ];
};

