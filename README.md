
# ringcentral-notification-demo-ui-app

A demo integration(notification app) for RingCentral desktop/web app, as a demo, shows you how to create a notification app with UI to config for RingCentral.

Created with [notification-app-js](https://github.com/ringcentral/notification-app-js)

## DEV Prerequisites

- Download and install RingCentral app and login: https://www.ringcentral.com/apps/rc-app
- Nodejs 8.10+/npm, recommend using [nvm](https://github.com/creationix/nvm) to install nodejs/npm.
- If you want to create RingCentral Glip integration that can show in RingCentral Glip apps list, you need a RingCentral developer account that can create Glip integration: you need [sign up](https://developers.ringcentral.com/) and apply for the permission to create Glip integration.
- Need a account that can login to [app.ringcentral.com](https://app.ringcentral.com)

## Quick start

Let's start this simple RingCentral Glip integration that post messages to a Glip team you selected.

```bash

# install dependecies
npm i

# start proxy server, this will make your local bot server can be accessed by RingCentral service
npm run ngrok

# will show
Forwarding                    https://xxxx.ap.ngrok.io -> localhost:6066
# Remember the https://xxxx.ap.ngrok.io, we will use it later
```

Goto RingCentral app's App list, select **Incoming Webhook** app, and choose a team, and copy the webhook url for later use, and confirm install.

```bash
# create env file
cp .env.sample .env
# then edit .env,
# set https://xxxx.ap.ngrok.io as RINGCENTRAL_APP_SERVER
# set webhook url copied as STATIC_WEBHOOK

# run local dev server
npm start

# run client
npm run c

```

Then visit `https://ringcentral.github.io/ringcentral-notification-app-developer-tool?frameName=my-app&webhook=YOUR_WEBHOOK_URL&appUrl=https://xxxx.ap.ngrok.io` to check how would it work in RingCentral app.

## Deploy to AWS Lambda

```bash
cp deploy/env.sample.yml deploy/env.yml
cp deploy/serverless.sample.yml deploy/serverless.yml

# then edit deploy/env.yml and deploy/serverless.yml

# deploy
npm run deploy
```

More detail: https://github.com/ringcentral/glip-integration-js/blob/master/docs/deploy-to-lambda.md
