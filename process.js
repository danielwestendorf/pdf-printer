const fs                 = require('fs');
const path               = require('path');
const debug              = require('debug')('pdf:processor');
const clone              = require('lodash.clonedeep');
const createPdfGenerator = require('pdf-bot/src/pdfGenerator')
const error              = require('pdf-bot/src/error');
const createQueue        = require('pdf-bot/src/queue');
const execSync           = require('child_process').execSync;

const configPath         = path.join(process.cwd(), 'pdf-bot.config.js');
const configuration      = require(configPath);
const queue              = initiateQueue();
const maxTries           = configuration.queue.generationMaxTries;
const retryStrategy      = configuration.queue.generationRetryStrategy;
const parallelism        = configuration.queue.parallelism;
const POLL_INTERVAL      = parseInt(process.env.POLL_INTERVAL);

// Entry point
// Assumes only one worker. Queue's busy is set to false, in case of prior
// crash or interrupt
queue.setIsBusy(false).then(findAndProcessNext);

function findAndProcessNext() {
  function timeout(duration) {
    duration = duration || POLL_INTERVAL;
    setTimeout(findAndProcessNext, duration);
  }

  queue.isBusy()
    .then((isBusy) => {
      if (!isBusy) {
        queue.getAllUnfinished(retryStrategy, maxTries)
          .then((jobs) => {
            if (jobs.length === 0) {
              debug('No jobs in the queue');
              timeout();
            } else {
              queue.setIsBusy(true).then(() => {
                const promises = [];
                // Process X of the Jobs available
                for (let i = 0; i < parallelism; i++) {
                  if (jobs[i] != undefined) {
                    promises.push(processJob(jobs[i], clone(configuration)));
                  }
                }

                console.log(" Found %s jobs, processing %s of them", jobs.length, promises.length);

                Promise.all(promises)
                  .then(() => {
                    if (jobs.length > promises.length) {
                      // There are more jobs to process, make haste!
                      queue.setIsBusy(false).then(() => {
                        timeout(0);
                      });
                    } else {
                      queue.setIsBusy(false).then(timeout);
                    }
                  })
                  .catch(() => {
                    return queue.setIsBusy(false).then(() => {
                      // invoke timeout
                      console.log('An error was caught')
                      timeout();
                    })
                  })
              });
            }
          });
      } else {
        debug('Queue is busy, why was this called?')
      }
    });
}

function initiateQueue() {
  const db           = configuration.db(configuration);
  const queueOptions = configuration.queue;

  return createQueue(db, queueOptions);
}

function processJob(job, configuration) {
  const generatorOptions = configuration.generator;
  const storagePlugins   = configuration.storage;

  const generator = createPdfGenerator(configuration.storagePath, generatorOptions, storagePlugins);

  return queue.processJob(generator, job, configuration.webhook).then((response) => {
    if (error.isError(response)) {
      console.error('Job ID ' + job.id + ' failed to process.')
      debug(response);
      return Promise.reject(response);
    } else {
      console.log('Job ID ' + job.id + ' was processed.')
      return Promise.resolve(true);
    }
  });
}
