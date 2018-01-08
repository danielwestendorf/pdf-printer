const htmlPdf        = require('html-pdf-chrome');
const createS3Config = require('pdf-bot/src/storage/s3');
const pgsql          = require('pdf-bot/src/db/pgsql');
const decaySchedule  = [
  1000 * 60, // 1 minute
  1000 * 60 * 3, // 3 minutes
  1000 * 60 * 10, // 10 minutes
  1000 * 60 * 30, // 30 minutes
  1000 * 60 * 60 // 1 hour
];

module.exports = {
  api: {
    port: process.env.PORT,
    token: process.env.API_TOKEN
  },
  storage: {
    s3: createS3Config({
      bucket: process.env.AWS_S3_BUCKET,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      region: process.env.AWS_S3_REGION,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    })
  },
  queue: {
    parallelism: parseInt(process.env.PARALLELISM),
    generationRetryStrategy: function(job, retries) {
      return decaySchedule[retries - 1] ? decaySchedule[retries - 1] : 0
    },
    generationMaxTries: 5,
    webhookRetryStrategy: function(job, retries) {
      return decaySchedule[retries - 1] ? decaySchedule[retries - 1] : 0
    },
    webhookMaxTries: 5
  },
  db: pgsql({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }),
  generator: {
    chromePath: process.env.GOOGLE_CHROME_SHIM,
    completionTrigger: new htmlPdf.CompletionTrigger.Event(
      process.env.RENDER_EVENT,
      process.env.RENDER_EVENT_ELEMENT,
      process.env.RENDER_EVENT_TIMEOUT
    )
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
    url: process.env.WEBHOOK_URL
  },
  storagePath: './storage'
}
