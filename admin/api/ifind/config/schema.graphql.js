module.exports = {
  definition: `
  enum BACKGROUND_PROCESS_STATUS {
    START
    STOP
    ERROR
  }

  enum BACKGROUND_PROCESS_NAME {
    product_validator
  }

  enum BACKGROUND_PROCESS_LOG_TYPE {
    INFO
    ERROR
  }

  type BackgroundProcessLogEntry {
    date_time: String
    type: BACKGROUND_PROCESS_LOG_TYPE
    message: String
  }

  type BackgroundProcess {
    status: BACKGROUND_PROCESS_STATUS
    logs: [BackgroundProcessLogEntry]
  }
  `,
  query: `
  getBackgroundProcess ( backgroundProcess: BACKGROUND_PROCESS_NAME! ): BackgroundProcess
  `,
  mutation: ``,
  type: {},
  resolver: {
    Query: {
      async getBackgroundProcess(_, { backgroundProcess }) {
        const backgroundProcessData = await strapi.services.ifind.getBackgroundProcess(backgroundProcess);
        return backgroundProcessData;
      },
    },
  },
};
