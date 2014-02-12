require 'sinatra/base'
require 'redis'
require 'json'
require 'oauth2'

$games = {}
$players = {
  # "thuneothuneo" => ["ntuheontuheo", 0],
  # "untetohathut" => ["ntuheontuheo", 1]
}

class FightClubApp < Sinatra::Base
end

require './games/mancala'

class FightClubApp
  get '/' do
    "Hello, world"
  end
end
