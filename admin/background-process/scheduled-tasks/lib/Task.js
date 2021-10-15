/**
 * TODO
 * - Drop the use of status. Get directly from the switch instead.
 */
const { existsSync } = require("fs");
const path = require("path");

const Switch = require("../../_lib/inc/Switch");
const { frequencies } = require("../config");
const Database = require("./Database");
const Logger = require("./Logger");
const Model = require("./Model");

const tasksRoot = path.resolve(__dirname, "../tasks");
const backgroundProcessesRoot = path.resolve(__dirname, "../../");

const EVENT_EMITTER = Symbol();

/**
 * Task base class
 *
 * A Task should have a corresponding BackgroundProcess
 * This class only triggers a BackgroundProcess to start/stop
 * This does not contain any logic for the BackgroundProcess
 */
class Task extends Model {
  constructor(config) {
    super();

    this.id = config.id;
    this.name = config.name;
    this.schedule = config.schedule;
    this.next_run = config.next_run;
    this.status = config.status || "stopped";

    // Get taskModulePath
    this.taskModulePath = path.resolve(tasksRoot, this.id);

    // Compute next_run if none
    if (!this.next_run) {
      this.computeNextRun();
    }

    const taskBackgroundProcessPath = path.resolve(
      backgroundProcessesRoot,
      this.id
    );

    // Initialize switch if any
    if (existsSync(taskBackgroundProcessPath)) {
      this.backgroundProcessSwitch = new Switch({
        baseDir: taskBackgroundProcessPath,
      });
      this.hasBackgroundProcess = true;
    }

    // Get current state
    this.status =
      this.backgroundProcessSwitch &&
      this.backgroundProcessSwitch.getState() === "START"
        ? "running"
        : "stopped";
  }

  init() {
    if (this.backgroundProcessSwitch) {
      this.backgroundProcessSwitch.init();
      this.watchBackgroundProcessSwitch();
    }
  }

  hasModule() {
    return this.taskModulePath && existsSync(this.taskModulePath);
  }

  // Task module should have onStart
  start() {
    if ( !this.backgroundProcessSwitch ) {
      return;;
    }

    // If process is already runnning,
    // no need to proceed
    if (/start/i.test(this.backgroundProcessSwitch.getState()) ) {
      return;
    }

    // Log
    Logger.log(`Triggered a Task run: ${this.name}`);

    // Compute for the next run
    this.computeNextRun();

    // Run the process
    this.backgroundProcessSwitch.start();

    // Run the task
    if (typeof this.onStart === "function") {
      this.setStatus("running");
      this.onStart();
    }
  }

  stop() {
    this.setStatus("stopped");

    // Log
    Logger.log(`Task stops: ${this.name}`);
  }

  setStatus(status) {
    if (status !== this.status) {
      this.status = status;
      this.update({ status });
      this.emit("statuschange", this);
    }
  }

  get running() {
    if ( this.backgroundProcessSwitch ) {
      return /start/i.test(this.backgroundProcessSwitch.getState());
    }

    return false;
  }

  log(message = "", type) {
    const formattedLogMessage = this.logger.formatLogMessage(message, type);

    // Save formattedLogMessage to db
  }

  // Computes next run schedule depending on config.shedule
  // Save the computed update in database
  async computeNextRun() {
    const now = Date.now();
    const { schedule } = this;


    const oldNextRun = this.next_run;

    while (!this.next_run || this.next_run <= now) {
      this.next_run = now + (schedule || frequencies["daily"]); // Default to daily
    }

    // Save to DB
    Database.update(Task.model, this.id, { next_run: this.next_run });
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

  watchBackgroundProcessSwitch() {
    // Listen to start
    this.backgroundProcessSwitch.listen("START", () => {
      this.computeNextRun();
      this.setStatus("running");
    });

    // Listen to stop
    this.backgroundProcessSwitch.listen("STOP", () => {
      this.setStatus("stopped");
    });

    // Listen to error
    this.backgroundProcessSwitch.listen("ERROR", () => {
      this.setStatus("stopped");
    });
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
Task.initializeWithData = function (rawData, willInitialize = false) {
  const taskPath = path.resolve(tasksRoot, rawData.id);
  let taskClass = Task;

  // If this task has a child Task class, use it
  if (existsSync(taskPath)) {
    taskClass = require(taskPath);
  }

  const instance = new taskClass(rawData);

  if (typeof instance.init === "function" && willInitialize) {
    instance.init();
  }

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
