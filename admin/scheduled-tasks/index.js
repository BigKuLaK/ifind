const path = require('path');
const { existsSync } = require("fs-extra");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config');
const config = existsSync(configPath) ? require(configPath) : {};

const timer = require('./lib/Timer');
const Task = require('./lib/Task');
const Database = require('./lib/Database');
const Logger = require('./lib/Logger');
const mapScheduleToFrequency = require('./utils/mapScheduleToFrequency');

const LOGGER = new Logger({ baseDir });

class ScheduledTasks {
  // List of all available processes, by id
  tasks = {};
  // ID of the currently running task
  runningTask = null;

  constructor() {
    this.ID = Date.now();
  }

  init() {
    if ( this.initialized ) {
      return;
    }

    this.initialized = true;

    // Check tasks config for changes and apply updates
    const configTasks = config.tasks;
    const dbTasks = Database.getAll(Task.model);

    configTasks.forEach(configTask => {
      const dbTask = dbTasks.find(task => task.id === configTask.id);

      // Check for changes and save if there is any
      if ( dbTask.name !== configTask.name || dbTask.schedule !== configTask.schedule ) {
        dbTask.update({
          name: configTask.name,
          schedule: configTask.schedule
        });
      }

      this.addTask(dbTask);
    });

    // Initialize timer
    timer.on('taskstart', this.start.bind(this));
    timer.init();

    LOGGER.log('Scheduled Tasks Runner initialized'.green);
  }

  runCommand(command, id) {
    const validCommands = [ 'start', 'stop' ];
    if ( validCommands.includes(command) ) {
      this[command].call(this, id);
    }

    return this.list();
  }

  /**
   * Gets the list of all available tasks
   */
  list() {
    const tasks = Object.values(this.tasks);
    return tasks.map(task => ({
      ...task,
      frequency: mapScheduleToFrequency(task.schedule),
    }));
  }

  start(id) {
    if ( this.runningTask === id || !(id in this.tasks) ) {
      return;
    }

    LOGGER.log('Starting task: ', id);
    const task = this.tasks[id];
    task.start();
  }

  stop(id) {
    if ( id in this.tasks ) {
      const _process = this.tasks[id];
      LOGGER.log('Killing task: ', id);
      _process.stop();
    }
  }

  getTask(taskID) {
    if ( id in this.tasks ) {
      return this.tasks[id].getLogs();
    }
  }

  addTask(taskData) {
    const task = Task.initializeWithData(taskData);

    // Handle task events
    task.on('message', (...args) => this.onProcessMessage(args));
    task.on('exit', () => this.onProcessExit(task.id));

    // Save task to list
    this.tasks[task.id] = task;
  }

  onProcessMessage(processArgs) {
    LOGGER.log({ processArgs });
  }

  onProcessExit(id) {
    this.runningTask = null;
    LOGGER.log(`Process exitted: ${id}`);
  }
};

module.exports = ScheduledTasks;
