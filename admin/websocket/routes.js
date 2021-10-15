const testController = require('./controllers/test');
const scheduledTasksController = require('./controllers/scheduled-tasks');

module.exports = {
  '/test': testController,
  '/scheduled-tasks': scheduledTasksController,
};
