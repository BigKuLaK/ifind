const Controller = require('../lib/Controller');
const Task = require('../../background-process/scheduled-tasks/lib/Task');
const ScheduledTasksBP = require('../../background-process/scheduled-tasks');

class ScheduledTasks extends Controller {
  actionHandlers = {
    'start-task': this.startTask,
    'stop-task': this.stopTask,
  };

  constructor(connection) {
    super(connection);
  }

  async onopen() {
    // Get initial scheduled tasks
    const tasks = await this.sendTasks();
    this.handleTaskEvents(tasks);
  }

  onmessage(message) {
    console.log('scheduled tasks route', { message });
  }

  handleTaskEvents(tasks) {
    tasks.forEach(task => {
      const taskInstance = Task.initializeWithData(task);

      taskInstance.on('statuschange', e => {
        console.log('statuschange');
        this.sendTasks();
      });
    });
  }

  startTask(taskID) {
    ScheduledTasksBP.startTask(taskID);
  }

  stopTask(taskID) {
    ScheduledTasksBP.stopTask(taskID);
  }

  async sendTasks() {
    const tasks = await strapi.services.ifind.scheduledTasksList();

    this.send('tasks', tasks);

    return tasks;
  }
}

module.exports = ScheduledTasks;
