/**
 * TODO:
 *  Setup WS routes and controllers
 *  Implement client auth: https://github.com/websockets/ws#client-authentication
 */

const WebSocket = require("ws");
const { Server  } = WebSocket;
const EventEmitter = require("events");

const ROUTES = require("./routes");
const Controller = require("./lib/Controller");
const EVENT_EMITTER = Symbol();

class WebSocketServer {
  constructor() {
    this[EVENT_EMITTER] = new EventEmitter();
  }

  init(httpServer) {
    this.server = new Server({ server: httpServer });

    // Handle all connections
    this.server.on('connection', (ws) => {
      this.mapConnectionToRoute(ws);
    });
  }

  mapConnectionToRoute(wsConnection) {
    // Get the actual route, removing the /ws/
    const route = '/' + (wsConnection.upgradeReq.url || '/').split('/').slice(2).join('/');

    if ( route in ROUTES && ROUTES[route].prototype instanceof Controller ) {
      const controller = new ROUTES[route](wsConnection);
      controller.init();
   }
  }
}

module.exports = WebSocketServer;
