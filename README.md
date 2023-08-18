# SlackApp

docker build --build-arg LOG_LEVEL=silly --build-arg PROJECT_NAME=adadot-slack --build-arg PORT=3100 --build-arg SLACK_SIGNING_SECRET=b4e --build-arg SLACK_APP_TOKEN=xapp-1 --build-arg REDIS_HOST=localhost --build-arg REDIS_PORT=6379 --build-arg ENVIRONMENT_NAME=prod --build-arg ADADOT_SERVICE_TOKEN=trewtres3645s643s643 --build-arg ADADOT_BACKEND_HOSTNAME=https://me.adadot.com -t my-adadot-slack .