fightclub
=========

A sinatra app that simulates a game of mancala, for two bots to play against each other. See [my blog post](http://lord.io/blog/2014/day-8/) for more information about the bot API and other details, or [play an example game](http://hsfightclub.herokuapp.com/mancala) of two random bots on Heroku. 

Includes a 3d visualizer of the game built with three.js, and a backend to manage game state built with Sinatra.

### Installation

To deploy to Heroku:

    heroku create
    git push heroku master

Starting the server on your local machine is as simple as running `foreman start`.

Happy hacking!
