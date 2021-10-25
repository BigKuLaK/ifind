/**
 * TODO: Abstract out custom Schema definitions for better structure
 */

module.exports = {
  definition: `
  enum TASK_STATUS {
    START
    STOP
    ERROR
  }
  enum TASK_LOG_TYPE {
    INFO
    ERROR
  }

  enum SCHEDULED_TASK_NAME {
    product_validator
  }

  enum SCHEDULED_TASK_STATUS {
    stopped
    running
  }

  type TaskLogEntry {
    date_time: String
    type: TASK_LOG_TYPE
    message: String
  }

  type Task {
    name: String!
    status: TASK_STATUS
    logs: [TaskLogEntry]
  }

  type ScheduledTask {
    id: String
    name: String
    status: SCHEDULED_TASK_STATUS
    frequency: String
    next_run: Float
    hasModule: Boolean
  }

  enum SCHEDULED_TASK_ACTION {
    start
    stop
  }

  type DealType {
      name: String
      label: String
      source: Source
  }

  type ScheduledTaskPayload {
    error: String
    data: [ScheduledTask]
  }
  `,
  query: `
  getTask ( id: String! ): Task
  scheduledTasksList: [ScheduledTask]
  sheduledTasks ( command: String, id: String ): ScheduledTaskPayload
  `,
  mutation: `
  triggerTask ( taskID: String, action: SCHEDULED_TASK_ACTION ): [ScheduledTask]
  `,
  type: {},
  resolver: {
    Query: {
      async sheduledTasks(_, { command, id }) {
        const data = strapi.scheduledTasks.runCommand(command, id);
        return { data };
      },
      async scheduledTasksList() {
        const tasks = strapi.scheduledTasks.list();
        return tasks;
      },
      async getTask(_, { id }) {
        return strapi.scheduledTasks.getTask(id);
      },
    },
    Mutation: {
      async triggerTask(_, args) {
        const { action: command, taskID: id } = args;
        const tasks = strapi.scheduledTasks.runCommand(command, id);
        return tasks;
      },
    },
  },
};
