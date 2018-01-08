# PDF Printer Service
## Heroku deployment of a pdf-bot
This project implements a one-click setup of [pdf-bot](https://github.com/esbenp/pdf-bot). HTML PDF rendering with Google Chrome, requested with a URL over HTTP, delivered when complete with a webhook, and stores the PDF's on Amazon S3.

### Deployment
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Click the deployment button to get the system running on Heroku
2. Configure the Config Vars below
3. Turn on the configured worker dyno
4. Submit a job to be generated

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
| RENDER_TIMER               | 1000               | Time, in ms, to wait before pdf capture                                 |
| RENDER_EVENT               | optional           | Event to signify the page is ready for pdf capture                      |
| RENDER_EVENT_ELEMENT       | optional           | Element which receive the render event                                  |
| RENDER_EVENT_TIMEOUT       | optional           | Time, in ms, to wait for the render event                               |


Set `DEBUG` Config var to `pdf:*` to get debugged output.
