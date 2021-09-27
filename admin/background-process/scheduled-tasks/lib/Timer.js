const Queue = require("./Queue");

const Timer = {
  timerInterval: null,

  runNextTask() {
    console.log("Determining next task to run...");
    const timeNow = Date.now();

    const availableTasks = Queue.getList();

    // Get the first available task and run it
    const [firstTask] = availableTasks;

    // Next reset will depend if there's task to run
    let resetTimeInterval = 0;

    // If task is not yet due to run,
    // just reset the timer
    if (!Queue.isTaskDueToRun(firstTask)) {
      // Use the interval from now to firstTask for the reset
      resetTimeInterval = firstTask.next_run - timeNow;
      console.log(
        `None found, next task runs in ${Number(
          resetTimeInterval / 1000
        ).toFixed(2)} second(s)`
      );
    }

    // Otherwise, run it!!!!!!
    else {

      // If already running, no need to do anything
      if ( firstTask.running ) {
        console.log(`Task is already running: ${firstTask.id}`);
      }
      else {
        console.log("Will run:", firstTask.id);

        // Run the task
        // This will also update firstTask's next_run
        firstTask.start();

        // Re-sort tasks, this would still include the firstTask
        availableTasks.sort((taskA, taskB) =>
          taskA.next_run < taskA.next_run ? -1 : 1
        );

        // Get next available task,
        // Get its next_run and use it to
        // compute for the interval till the next timer tick
        const [nextTaskToRun] = availableTasks;
        resetTimeInterval = nextTaskToRun.next_run - timeNow;

        console.log('nextTaskToRun.next_run', nextTaskToRun.next_run);
        console.log('timeNow', timeNow);
      }
    }

    console.log({ resetTimeInterval });

    // Reset timer
    if (resetTimeInterval ) {
      this.resetTimer(resetTimeInterval);
    }
  },

  resetTimer(interval = 0) {
    this.timerInterval = setTimeout(this.runNextTask.bind(this), interval);
  },
};

module.exports = Timer;
