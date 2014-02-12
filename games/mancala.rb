class Mancala
  STARTING_SEEDS = 2
  attr_accessor :scores
  attr_reader :houses
  attr_accessor :status
  attr_reader :turn

  def initialize
    @houses = []
    13.times { @houses << STARTING_SEEDS }
    @houses[6] = 0
    @houses[13] = 0
    @status = [false, false]
    @turn = 0
  end

  def scores
    [@houses[6], @houses[13]]
  end

  def move(player, house)
    seeds = @houses[house]
    @houses[house] = 0

    while seeds > 0
      house += 1
      house = 7 if house == 6 && player == 1
      house = 0 if house == 13 && player == 0
      house = 0 if house == 14
      seeds -= 1
      @houses[house] += 1
    end

    # Swap the turns if the player didn't finish in the keep
    # I think the finishing in the keep not changing the turn thing might be broken
    @turn = (player + 1) % 2 unless house == 6 or house == 13
  end
end

class FightClubApp
  get '/mancala' do
    # redirect to random new game
    begin
      game_name = (0...8).map { (65 + rand(26)).chr }.join
    end while $games[game_name] != nil
    $games[game_name] = Mancala.new

    2.times do |player_side|
      begin
        name = (0...8).map { (65 + rand(26)).chr }.join
      end while $players[name] != nil

      $players[name] = [game_name, player_side]
    end

    redirect to('/mancala/games/' + game_name)
  end

  get '/players' do
    $players.to_json
  end

  get '/mancala/games/:game_id' do
    # shows a game
    if $games[params[:game_id]].nil?
      return 404
    else
      return "okay! game ajax code here"
    end
  end

  get '/mancala/games/:game_id/json' do
    # params :game_id
    # returns the board status in json, used for /mancala/:game_id ajax
    {
      status: [
        false,
        false
      ],
      board: $games[params[:game_id]].houses,
      turn: $games[params[:game_id]].turn
    }.to_json
  end

  get '/mancala/move' do
    # shows player ids, and then as they connect it shows the game board
    # params :player_id, :move
    return 400 if params[:player_id].nil? || params[:house].nil?
    player = $players[params[:player_id]]
    game = $games[player[0]]
    game_turn = game.turn

    if player[1] != game_turn
      return 409
    end

    game.move(player[1].to_i, params[:house].to_i)
    return 'Now time for your opponent!'

  end

  get '/mancala/status' do
    # optional params on first status check :player_name, :player_color
    # params :player_id
    return 400 if params[:player_id].nil? || $players[params[:player_id]].nil?

    player = $players[params[:player_id]]

    game = $games[player[0]]
    player_side = player[1]

    return "waiting" if game.turn != player_side

    game.houses.join ' '
    # used by players
    # returns the board if it's your turn
    # returns just the string "waiting" if you should wait a few seconds before requesting again
    # returns "victory" or "defeat" if the game is over
  end
end
