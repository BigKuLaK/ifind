const path = require('path');
const { existsSync } = require("fs-extra");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config');
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require('./lib/Timer');
const Task = require('./lib/Task');
const Database = require('./lib/Database');

class ScheduledTasks {
  // List of all available processes, by id
  tasks = {};
  // ID of the currently running task
  runningTask = null;

  init() {
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
  }

  runCommand(command, id) {
    if ( command in this ) {
      this[command].call(this, id);
    }
  }

  /**
   * Gets the list of all available tasks
   */
  list() {
    return Object.values(this.tasks);
  }

  start(id) {
    if ( this.runningTask === id || !(id in this.tasks) ) {
      return;
    }

    console.log('Starting task: ', id);
    const task = this.tasks[id];
    task.start();
  }

  stop(id) {
    if ( id in this.tasks ) {
      const _process = this.tasks[id];
      console.log('Killing task: ', id);
      _process.kill();
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
    console.log({ processArgs });
  }

  onProcessExit(id) {
    console.log({ processExited: id });
    this.runningTask = null;
  }
};

const scheduledTasks = new ScheduledTasks;
scheduledTasks.init();

module.exports = scheduledTasks;
