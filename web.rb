require 'sinatra/base'
require 'redis'
require 'json'

$games = {}
$players = {}

require './mancala'

class FightClubApp < Sinatra::Base

  configure do
    if ENV["REDISCLOUD_URL"]
      uri = URI.parse(ENV["REDISCLOUD_URL"])
      $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
    else
      raise "Please set the REDISCLOUD_URL env variable. See the README for more information."
    end
  end

  get '/' do
    "Hello, world"
  end

  get '/mancala' do
    # redirect to random new game
    name = (0...8).map { (65 + rand(26)).chr }.join
    redirect to('/mancala/games/' + name)
  end

  get '/mancala/games/:game_id' do
    # shows a game
    if $games[params[:game_id]] == nil
      $games[params[:game_id]] = Mancala.new
    end

    game = $games[params[:game_id]]
  end

  get '/mancala/games/:game_id/json' do
    # params :game_id
    # returns the board status in json, used for /mancala/:game_id ajax
    {
      status: [
        false,
        false
      ],
      board: $games[params[:game_id]].houses
    }.to_json
  end

  post '/mancala/move' do
    # shows player ids, and then as they connect it shows the game board
    # params :player_id, :move
    $games[params[:game_id]].move(params[:player_id], params[:game_id], params[:move])
  end

  get '/mancala/status' do
    # params :player_id
    # optional params on first status check :player_name, :player_color
    # used by players
    # returns the board if it's your turn
    # returns just the string "waiting" if you should wait a few seconds before requesting again
    # returns "victory" or "defeat" if the game is over
  end
end
