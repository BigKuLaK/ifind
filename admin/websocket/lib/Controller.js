const WebSocket = require("ws");

const EVENTS = [
  'message',
  'close',
  'error',
  'ping',
  'pong',
];

class Controller {
  // actionHandlers to be supplied by the child class
  actionHandlers = {
    // actionName: payloadHandlerFunction
  }

  constructor(webSocketConnection) {
    if ( webSocketConnection instanceof WebSocket ) {
      this.connection = webSocketConnection;
    }
    else {
      throw new Error('Supplied connection must be a valid WebSocket instance.');
    }
  }

  init() {
    EVENTS.forEach(event => {
      const eventMethod = `on${event}`;

      if ( eventMethod in this ) {
        this.connection.addEventListener(event, (eventData) => {
          if ( event === 'message' ) {
            this._processMessageData(JSON.parse(eventData.data));
          } else {
            this[eventMethod](eventData);
          }
        });
      }
    });

    if ( typeof this.onopen ) {
      this.onopen();
    }
  }

  // Events
  onclose(message) {}
  onerror(message) {}
  onping(message) {}
  onpong(message) {}
  onopen(message) {}

  _processMessageData({ action, payload }) {
    if ( action in this.actionHandlers && typeof this.actionHandlers[action] === 'function' ) {
      this.actionHandlers[action].call(this, payload);
    }
  }

  // Methods
  send(action, payload) {
    if ( typeof action !== 'string' ) {
      throw new Error('Please provide an action when sending a WS data');
    }

    // Stringify data as JSON
    const jsonString = JSON.stringify({ action, payload });
    this.connection.send(jsonString);
  }
}

module.exports = Controller;

