const EventEmitter = require("events");
const Logger = require("./inc/Logger");
const Switch = require("./inc/Switch");

const EVENT_EMITTER = Symbol();

/**
 * BackgroundProcess
 *
 * CONFIG
 * baseDir - the root folder path for the background process
 */
class BackgroundProcess {
  constructor(config) {
    this.name = this.__proto__.constructor.backgroundProcessName;

    this.baseDir = config.baseDir;

    this[EVENT_EMITTER] = new EventEmitter();

    // Initialize switch
    this.switch = new Switch({
      baseDir: this.baseDir,
    });

    // Initialize logger
    this.logger = new Logger({
      baseDir: this.baseDir,
    });

    this.watchSwitch();
  }

  init() {
    // Notify
    this.logger.log(`Initializing ${this.__proto__.constructor.name}`);

    // Ensure that switch is on STOP state upon initialization
    this.switch.stop();

    // Initialize switch
    this.switch.init();

    // After init
    setTimeout(() => {
      if ( typeof this.afterInit === 'function' ) {
        this.afterInit();
      }
    }, 1000);
  }

  watchSwitch() {
    // Listen to start
    this.switch.listen("START", () => {
      if (typeof this.onSwitchStart === "function") {
        this.onSwitchStart();
      }
      this[EVENT_EMITTER].emit('start');
    });

    // Listen to stop
    this.switch.listen("STOP", () => {
      if (typeof this.onSwitchStop === "function") {
        this.onSwitchStop();
      }
      this[EVENT_EMITTER].emit('stop');
    });

    // Listen to error
    this.switch.listen("ERROR", () => {
      if (typeof this.onSwitchError === "function") {
        this.onSwitchError();
      }
      this[EVENT_EMITTER].emit('error');
    });
  }

  on(event, callback) {
    this[EVENT_EMITTER].on(event, callback);
  }

  emit(event, data) {
    this[EVENT_EMITTER].emit(event, data);
  }

  get running() {
    return /start/i.test(this.switch.getState());
  }
}

module.exports = BackgroundProcess;
