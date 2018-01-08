# PDF Printer Service
## Heroku deployment of a pdf-bot
This project implements a one-click setup of [pdf-bot](https://github.com/esbenp/pdf-bot). HTML PDF rendering with Google Chrome, requested with a URL over HTTP, delivered when complete with a webhook. Stores the PDF's on Amazon S3.

⚠️ This project is dependent on a fork of pdf-bot because of [this PR](https://github.com/esbenp/pdf-bot/pull/16). Once it's merged, the dependency should be able to point directly to `pdf-bot`.

### Deployment
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Configuration
Set the Heroku Config Vars


| ENV Variable               | Default Value      | Description                                                             |
| -------------              |:-------------:     | -----                                                                   |
| API_TOKEN                  | REPLACE_ME         | A secret key for accessing the printer API.                             |
| AWS_S3_BUCKET              | REPLACE_ME         | AWS S3 Bucket Name                                                      |
| AWS_S3_ACCESS_KEY_ID       | REPLACE_ME         | AWS S3 Access Key ID                                                    |
| AWS_S3_SECRET_ACCESS_KEY   | REPLACE_ME         | AWS S3 Secret Access Key                                                |
| AWS_S3_REGION              | REPLACE_ME         | AWS S3 Bucket Region                                                    |
| WEBHOOK_SECRET             | REPLACE_ME         | Secret to use when sending webhooks                                     |
| WEBHOOK_URL                | REPLACE_ME         | URL to send webhooks to when generation is complete                     |
| PARALLELISM                | 4                  | How many parallel renders per worker                                    |
| POLL_INTERVAL              | 100                | Time interval, in ms, to check the database for new jobs to process     |
| RENDER_EVENT               | 'DOMContentLoaded' | Event to signify the page is ready for pdf capture                      |
| RENDER_EVENT_ELEMENT       | 'body'             | Element which receive the render event                                  |
| RENDER_EVENT_TIMEOUT       | 2000               | Time, in ms, to wait for the render event before forcing capture anyway |


Set `DEBUG` Config var to `pdf:*` to get debugged output.
