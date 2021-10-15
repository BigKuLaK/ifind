/**
 * TODO: Abstract out custom Schema definitions for better structure
 */

module.exports = {
  definition: `
  enum BACKGROUND_PROCESS_STATUS {
    START
    STOP
    ERROR
  }

  enum BACKGROUND_PROCESS_LOG_TYPE {
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

  type BackgroundProcessLogEntry {
    date_time: String
    type: BACKGROUND_PROCESS_LOG_TYPE
    message: String
  }

  type BackgroundProcess {
    name: String!
    status: BACKGROUND_PROCESS_STATUS
    logs: [BackgroundProcessLogEntry]
  }

  type ScheduledTask {
    id: String
    name: String
    status: SCHEDULED_TASK_STATUS
    frequency: String
    next_run: Float
    hasBackgroundProcess: Boolean
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
  `,
  query: `
  getBackgroundProcess ( backgroundProcess: String! ): BackgroundProcess
  triggerScheduledTask ( scheduledTask: SCHEDULED_TASK_NAME!, status: BACKGROUND_PROCESS_STATUS! ): ScheduledTask
  scheduledTasksList: [ScheduledTask]
  `,
  mutation: `
  triggerTask ( taskID: String, action: SCHEDULED_TASK_ACTION ): [ScheduledTask]
  `,
  type: {},
  resolver: {
    Query: {
      async scheduledTasksList() {
        const tasks = await strapi.services.ifind.scheduledTasksList();
        return tasks;
      },
      async getBackgroundProcess(_, { backgroundProcess }) {
        const backgroundProcessData =
          await strapi.services.ifind.getBackgroundProcess(backgroundProcess);
        return backgroundProcessData;
      },
    },
    Mutation: {
      async triggerTask(_, args) {
        await strapi.services.ifind.triggerTask(args.taskID, args.action);
        const tasks = await strapi.services.ifind.scheduledTasksList();
        return tasks;
      },
    },
  },
};
