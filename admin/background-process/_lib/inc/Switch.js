const path = require("path");
const { outputFileSync, readFileSync, existsSync } = require("fs-extra");
const chokidar = require("chokidar");
const EventEmitter = require("events");
const Logger = require("./Logger");

/**
 * CONFIG
 *
 * baseDir = The background process base dir
 */
class Switch {
  constructor(config) {
    this.baseDir = path.resolve(config.baseDir)
    this.switchFilePath = path.resolve(this.baseDir, '.switch');
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
    this.logger = new Logger(config);
  }

  onSwitchChange (listenedState, callback) {
    if (this.isValidState(listenedState) && callback instanceof Function) {
      this.emitter.on('switchChange', (switchState) => {
        if (switchState === listenedState) {
          callback();
        }
      });
    }
  };

  // Sets the switch file to START
  start () {
    this.logger.log('(Switch) Starting...');
    outputFileSync(this.switchFilePath, "START");
  };

  // Sets the switch file to STOP
  stop () {
    this.logger.log('(Switch) Stopping...');
    outputFileSync(this.switchFilePath, "STOP");
  };

  // Sets the switch file to ERROR
  error () {
    outputFileSync(this.switchFilePath, "ERROR");
  };

  // Returns the current switch state
  getState () {
    if ( existsSync(this.switchFilePath) ) {
      const switchState = readFileSync(this.switchFilePath).toString().trim();
      return this.isValidState(switchState) ? switchState : null;
    }


    return 'STOP';
  };

  /**
   * Adds an event listener to switch state change
   * @param {String} state - The event
   * @param {Function} callback - Event handler
   */
  listen (state, callback) {
    this.onSwitchChange(state, callback);
  };

  // Ensures we can only use valid states : START,STOP,ERROR
  isValidState (state) {
    return /^\s*(START|STOP|ERROR)\s*$/.test(state)
  }

  // Listen to the switchFile, leveraging emitter to send events to listeners
  init () {
    let currentState = this.getState();

    chokidar.watch(this.switchFilePath).on("change", () => {
      const newState = this.getState();

      if ( this.isValidState(newState) && currentState !== newState ) {
        currentState = newState;
        this.emitter.emit('switchChange', newState);
      }
    });

    this.logger.log('Initialized switch file watcher.');
  }
}

module.exports = Switch;
