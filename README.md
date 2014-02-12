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

For local testing, you can spoof Redis Cloud by creating a local Redis server and running this command before you start the server (replace the port number with your redis' port number):

    export REDISCLOUD_URL="redis://:yourpasswordhere@localhost:6379"

Starting the server on your local machine is as simple as running `foreman start`.

Happy hacking!
