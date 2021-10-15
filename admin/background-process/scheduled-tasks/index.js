const path = require("path");
const { existsSync } = require("fs-extra");
const BackgroundProcess = require("../_lib/BackgroundProcess");

const baseDir = path.resolve(__dirname);
const configPath = path.resolve(baseDir, 'config');
const config = existsSync(configPath) ? require(configPath) : {};
const timer = require('./lib/Timer');
const Task = require('./lib/Task');
const Database = require('./lib/Database');


class ScheduledTasks extends BackgroundProcess {
  constructor(config) {
    super({ baseDir });
    this.config = config;
  }

  afterInit() {
    // Check tasks config for changes and apply updates
    const configTasks = config.tasks;
    const dbTasks = Database.getAll(Task.model);

    configTasks.forEach(configTask => {
      const dbTask = dbTasks.find(task => task.id === configTask.id);

      // Check for changes and save if there is any
      if ( dbTask.name !== configTask.name || dbTask.schedule !== configTask.schedule ) {
        Database.update(Task.model, configTask.id, {
          name: configTask.name,
          schedule: configTask.schedule
        });
      }
    });

    // Ensure database contents
    timer.runNextTask();
  }

  startTask(taskID) {
    const matchedTask = Task.get(taskID);

    if ( matchedTask && matchedTask.backgroundProcessSwitch ) {
      console.log(`Starting task: ${taskID}`);
      matchedTask.backgroundProcessSwitch.start();
    }
  }

  stopTask(taskID) {
    const matchedTask = Task.get(taskID);

    if ( matchedTask && matchedTask.backgroundProcessSwitch ) {
      console.log(`Stopping task: ${taskID}`);
      matchedTask.backgroundProcessSwitch.stop();
    }
  }

  async getTasks() {
    return Task.getAll();
  }

  async getTask(taskId) {
    Task.get(taskId);
  }

  onSwitchStart() {
    // console.log('Switch start');
  }

  onSwitchStop() {
    // Stop whatever is currently running
  }

  onSwitchError() {
    // Stop whatever task is currently running
  }
}

ScheduledTasks.backgroundProcessName = 'Scheduled Tasks';

// Initialize Background Process
const scheduledTask = new ScheduledTasks(config);

module.exports = scheduledTask;
