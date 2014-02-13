fightclub
=========

A sinatra app for a programming competition at Hacker School.

### Installation

To deploy to Heroku:

    heroku create
    git push heroku master

Fight club also requires the Redis Cloud Heroku plugin and a Postgres database to properly deploy to Heroku. You can get small instances of both for free, with these commands:

    heroku addons:add rediscloud
    heroku addons:add heroku-postgresql:dev

For Hacker School authentication, you'll also have to create an OAuth2 app on your [Hacker School settings page](https://www.hackerschool.com/settings) and add them to your Heroku config vars:

    heroku config:set HS_OAUTH_ID="youridhere"
    heroku config:set HS_OAUTH_SECRET="yoursecrethere"

For local testing, you can spoof Redis Cloud by creating a local Redis server and running this command before you start the server (replace the port number with your redis' port number):

    export REDISCLOUD_URL="redis://:yourpasswordhere@localhost:6379"

For local testing, you'll also want Hacker School authentication to work, so simple set your Hacker School oAuth ID and Secret as enviroment variables:

    export HS_OAUTH_ID="youridhere"
    export HS_OAUTH_SECRET="yoursecrethere"

Starting the server on your local machine is as simple as running `foreman start`.

Happy hacking!
