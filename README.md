#
# Slack Event Listener

An open-source solution designed to seamlessly connect your Slack workspace with the Adadot API. With this app, users gain the flexibility to view and configure specific Slack events, deciding precisely which ones (and with what information) are forwarded to our APIs.

## Setting Up a Slack App

Before you can run your Bolt app, you'll need to set up a Slack app on the [Slack API](https://api.slack.com/) platform. Below, you'll find two different approaches to do so.

### Approach 1: Using User Scopes

In this approach, each user will need to install the app individually. This provides a more fine-grained control over the permissions the app requires and ensures that only users who require the app's functionality need to install it. This means that only events for users that have installed the app themselves will trigger the app event listeners.


1. Go to the Slack API platform and create a new app. 
2. Select "From app manifest". 
3. Select your workspace.
4. When prompted for the app manifest, use the one provided below. 

#### App Manifest JSON

```json
{
   "display_information": {
      "name": "Slack Event Listener",
      "description": "Notifications and Collaboration Analytics",
      "background_color": "#000000",
      "long_description": "This app will listen and forward slack events to the Adadot API"
   },
   "features": {
      "app_home": {
         "home_tab_enabled": false,
         "messages_tab_enabled": false,
         "messages_tab_read_only_enabled": false
      },
      "bot_user": {
         "display_name": "Adadot Bot",
         "always_online": true
      }
   },
   "oauth_config": {
      "redirect_urls": [],
      "scopes": {
         "user": [
            "channels:history",
            "channels:read",
            "groups:history",
            "im:history",
            "im:read",
            "users:read",
            "groups:read",
            "mpim:read",
            "mpim:history",
            "team:read",
            "users:read.email",
            "usergroups:read",
            "reactions:read"
         ],
         "bot": [
            "channels:history",
            "channels:read",
            "chat:write",
            "commands",
            "groups:history",
            "groups:read",
            "im:history",
            "im:read",
            "mpim:history",
            "mpim:read",
            "users:read",
            "users:read.email",
            "team:read",
            "workflow.steps:execute",
            "dnd:read",
            "reactions:read"
         ]
      }
   },
   "settings": {
      "event_subscriptions": {
         "user_events": [
            "channel_created",
            "channel_rename",
            "im_close",
            "im_created",
            "im_open",
            "member_joined_channel",
            "member_left_channel",
            "message.app_home",
            "message.channels",
            "message.groups",
            "message.im",
            "message.mpim",
            "reaction_added",
            "reaction_removed",
            "user_huddle_changed",
            "user_status_changed"
         ],
         "bot_events": [
            "app_home_opened",
            "app_uninstalled",
            "channel_created",
            "channel_rename",
            "dnd_updated_user",
            "member_joined_channel",
            "member_left_channel",
            "message.channels",
            "message.groups",
            "message.im",
            "message.mpim",
            "reaction_added",
            "reaction_removed",
            "team_join",
            "tokens_revoked",
            "user_huddle_changed",
            "user_status_changed"
         ]
      },
      "interactivity": {
         "is_enabled": true
      },
      "org_deploy_enabled": false,
      "socket_mode_enabled": true,
      "token_rotation_enabled": false
   }
}
```

Note: feel free to change anything you wish in the app manifest, but keep in mind removing events from event subscriptions OR corresponding scopes will cause the events to not be triggered in the app.

#### Installation of the app

After you have created the app, navigate to "Basic Information" and under "Install your app". You will need to install the app, and take note of the **Signing Secret**. 
Under basic information, you will also need to create a new  **App Token**  with the connections:write scope:

![image](https://github.com/AdadotTeam/slack-event-listener/assets/101565191/f9a687bc-8d5e-496a-9967-ab69ef927500)

Take note of the token value after you create it. Finally, you will also need to get the **Bot Token** for the slack app. You find this under the Oauth & Permissions:

![image](https://github.com/AdadotTeam/slack-event-listener/assets/101565191/382d334c-57b3-4910-9b53-a90022450c5c)

If you don't see the Bot Token there, make sure you have installed the app to your workspace. 
You will need to provide these values as environmental variables for the Bolt app. 
You can then copy the installation link from the button you just clicked and share it with all the other users that want to install the app to have their events forwarded to the Adadot API.

### Approach 2: Using Bot Scopes

This approach involves a workspace-wide installation. An admin or someone with the necessary permissions will need to install the app once for the entire workspace. For events to be triggered in the app, the app bot will need to be added to each channel.

1. Go to the Slack API platform and create a new app.
2. Select "From app manifest".
3. Select your workspace.
4. When prompted for the app manifest, use the one provided below.


#### App Manifest JSON

```json
{
   "display_information": {
      "name": "Slack Event Listener",
      "description": "Notifications and Collaboration Analytics",
      "background_color": "#000000",
      "long_description": "This app will listen and forward slack events to the Adadot API"
   },
   "features": {
      "app_home": {
         "home_tab_enabled": false,
         "messages_tab_enabled": false,
         "messages_tab_read_only_enabled": false
      },
      "bot_user": {
         "display_name": "Adadot Bot",
         "always_online": true
      }
   },
   "oauth_config": {
      "redirect_urls": [],
      "scopes": {
         "bot": [
            "channels:history",
            "channels:read",
            "chat:write",
            "commands",
            "groups:history",
            "groups:read",
            "im:history",
            "im:read",
            "mpim:history",
            "mpim:read",
            "users:read",
            "users:read.email",
            "team:read",
            "workflow.steps:execute",
            "dnd:read",
            "reactions:read"
         ]
      }
   },
   "settings": {
      "event_subscriptions": {
         "bot_events": [
            "app_home_opened",
            "app_uninstalled",
            "channel_created",
            "channel_rename",
            "dnd_updated_user",
            "member_joined_channel",
            "member_left_channel",
            "message.channels",
            "message.groups",
            "message.im",
            "message.mpim",
            "reaction_added",
            "reaction_removed",
            "team_join",
            "tokens_revoked",
            "user_huddle_changed",
            "user_status_changed"
         ]
      },
      "interactivity": {
         "is_enabled": true
      },
      "org_deploy_enabled": false,
      "socket_mode_enabled": true,
      "token_rotation_enabled": false
   }
}
```

Note: feel free to change anything you wish in the app manifest, but keep in mind removing events from event subscriptions OR corresponding scopes will cause the events to not be triggered in the app.

#### Installation of the app

After you have created the app, navigate to "Basic Information" and under "Install your app". You will need to install the app, and take note of the **Signing Secret**. 
Under basic information, you will also need to create a new  **App Token**  with the connections:write scope:

![image](https://github.com/AdadotTeam/slack-event-listener/assets/101565191/f9a687bc-8d5e-496a-9967-ab69ef927500)

Take note of the token value after you create it. Finally, you will also need to get the **Bot Token** for the slack app. You find this under the Oauth & Permissions:

![image](https://github.com/AdadotTeam/slack-event-listener/assets/101565191/382d334c-57b3-4910-9b53-a90022450c5c)

If you don't see the Bot Token there, make sure you have installed the app to your workspace. 
You will need to provide these values as environmental variables for the Bolt app. 

## Getting your Adadot API key

Assuming you already have an Adadot account, you can navigate to the [Adadot Developer Portal](https://me.adadot.com/developer-portal) where you will be able to issue an API key for use with the app.

## Running Your Slack Bolt App

Once you have your Slack app set up, you can run your Bolt app using either Docker or pure Node.js.

### Using Docker

1. Clone this repository.

   ```
   git clone https://github.com/AdadotTeam/slack-event-listener
   ```

2. Build the Docker image with the correct environmental variables that you have from the first app installation.

   ```
    docker build --build-arg LOG_LEVEL=silly --build-arg PROJECT_NAME=adadot-slack --build-arg PORT=3100 --build-arg SLACK_SIGNING_SECRET=b4e --build-arg SLACK_APP_TOKEN=xapp-1 --build-arg REDIS_HOST=localhost --build-arg REDIS_PORT=6379 --build-arg ENVIRONMENT_NAME=prod --build-arg API_KEY=trewtres3645s643s643 --build-arg API_URL=https:// -t my-adadot-slack .   ```
   ```

3. Run the Docker container.

   ```
   docker run -p 3100:3100 [name-of-your-image]
   ```

### Using Node.js

1. Clone this repository.

   ```
   git clone https://github.com/AdadotTeam/slack-event-listener
   ```

2. Install the dependencies using npm.

   ```
   npm install
   ```

3. Set your environment variables.

   ```bash
   export SLACK_BOT_TOKEN='Your-Slack-Bot-Token'
   export SLACK_SIGNING_SECRET='Your-Signing-Secret'
   export API_KEY='Your-API-Key'
   export API_URL='your-api-url'
   ```

4. Start the server.

   ```
   npm start
   ```

## License

This project is licensed under the MIT License.

```
MIT License


Copyright (c) 2023 Adadot Ltd. 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
