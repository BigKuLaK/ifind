const scheduledTasks = appRequire('background-process/scheduled-tasks');
const mapScheduleToFrequency = require('./mapScheduleToFrequency');

module.exports = async () => {
  const tasks = await scheduledTasks.getTasks();
  return tasks.map(task => ({
    ...task,
    frequency: mapScheduleToFrequency(task.schedule),
  }));
}
