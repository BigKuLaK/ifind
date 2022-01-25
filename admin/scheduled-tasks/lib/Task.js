const { existsSync } = require("fs-extra");
const childProcess = require("child_process");
const path = require("path");
const EventEmitter = require("events");

const { frequencies } = require("../config");
const Database = require("./Database");
const Logger = require("./Logger");
const Model = require("./Model");

const tasksRoot = path.resolve(__dirname, "../tasks");
const EVENT_EMITTER_KEY = Symbol();

const STATUS_RUNNING = 'running';
const STATUS_STOPPED = 'stopped';

/**
 * Task base class
 *
 * A Task should have a corresponding BackgroundProcess
 * This class only triggers a BackgroundProcess to start/stop
 * This does not contain any logic for the BackgroundProcess
 */
class Task extends Model {
  process = null;

  constructor(config) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.schedule = config.schedule;
    this.next_run = config.next_run;
    this.last_run = config.last_run;
    this.status = config.status || STATUS_STOPPED;

    // Get taskModulePath
    this.taskModulePath = path.resolve(tasksRoot, this.id);
    this.taskModuleFile = path.resolve(this.taskModulePath, 'index.js');
    this.hasModule = existsSync(this.taskModuleFile);

    // Event emitter
    this[EVENT_EMITTER_KEY] = new EventEmitter();

    // Logger
    this.logger = new Logger({ baseDir: this.taskModulePath });
    // Compute next_run if none

    if (!this.next_run) {
      console.log(`No next_run provided for ${config.id.bold}, recomputing...`);
      this.computeNextRun();
    }
  }

  get running() {
    return this.status === STATUS_RUNNING;
  }

  on(event, handler) {
    this[EVENT_EMITTER_KEY].on(event, handler);
  }

  async start() {
    if ( this.hasModule && !this.running ) {
      this.process = childProcess.fork(this.taskModuleFile, [], { stdio: 'pipe' });

      await this.computeNextRun();
      await this.setRunning();
      await this.saveLastRun();

      this.process.stdout.on('data', (data) => this.log(data.toString()));
      this.process.stderr.on('data', (data) => this.log(data.toString(), 'ERROR'));

      this.process.on('error', (data) => {
        this[EVENT_EMITTER_KEY].emit('error', data);
        this.stop();
      });

      this.process.on('exit', () => {
        console.log('process exits');
        this[EVENT_EMITTER_KEY].emit('exit');
        this.setStopped();
        this.process = null;
      });
    }
  }

  stop() {
    if ( this.running && this.process ) {
      this.process.kill('SIGINT');
    }
  }

  setRunning() {
    this.status = STATUS_RUNNING;
  }

  setStopped() {
    this.status = STATUS_STOPPED;
  }

  getLogs() {
    return this.logger.getAll();
  }

  log(message = "", type) {
    this.logger.log(message, type);
  }

  // Computes next run schedule depending on config.shedule
  // Save the computed update in database
  async computeNextRun() {
    const now = Date.now();
    const { schedule } = this;

    while (!this.next_run || this.next_run <= now) {
      this.next_run = this.next_run + (schedule || frequencies["daily"]); // Default to daily
    }

    // Save to DB
    Database.update(Task.model, this.id, { next_run: this.next_run });
  }

  // Saves last_run
  async saveLastRun() {
    const now = Date.now();

    // Save to DB
    Database.update(Task.model, this.id, { last_run: now });
  }

  // Adjusts next run by the given milliseconds
  adjustNextRun(milliseconds = 0) {
    const next_run = (this.next_run || Date.now()) + milliseconds;

    // Save
    this.update({ next_run });
  }

  getData() {
    return this.sanitizeData(this);
  }
}

/**
 * Static props
 */
Task.model = "task";

/**
 * Static methods
 *
 */
Task.initializeWithData = function (rawData) {
  const instance = new Task(rawData);
  return instance;
};
Task.get = function (taskID, willInitialize) {
  const matchedTask = Database.get(this.model, { id: taskID });

  if (matchedTask) {
    return Task.initializeWithData(matchedTask, willInitialize);
  } else {
    return null;
  }
};
Task.getAll = function (willInitialize = false) {
  return (
    // Get alll database entries
    Database.getAll(this.model)
      // Instantiate as Task instances
      .map(taskData => Task.initializeWithData(taskData, willInitialize))
  );
};

module.exports = Task;
