require 'sinatra/base'
require 'redis'
require 'json'
require 'oauth2'

class FightClubApp < Sinatra::Base
end

require './games/mancala'

class FightClubApp
  get '/' do
    "Hello, world"
  end
end
