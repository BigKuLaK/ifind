const scheduledTasks = appRequire('background-process/scheduled-tasks');
const mapScheduleToFrequency = require('./mapScheduleToFrequency');

module.exports = async (taskID, action) => {
  console.log({ action });
  switch ( action ) {
    case 'start':
      scheduledTasks.startTask(taskID);
      break;
    case 'stop':
      scheduledTasks.stopTask(taskID);
      break;
  }
  const tasks = await scheduledTasks.getTasks();
  return tasks.map(task => ({
    ...task,
    frequency: mapScheduleToFrequency(task.schedule),
  }));
}
