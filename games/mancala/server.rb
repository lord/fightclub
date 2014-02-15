$games = {}
$players = {}

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
    return [400, "You need to specify a player and a house to move from"] if params[:player_id].nil? || params[:house].nil?

    player = $players[params[:player_id]]
    return [404, "Can't find that player"] if player.nil?

    game = $games[player[0]]
    return [404, "Can't find that game"] if game.nil?

    if game.move(player[1].to_i, params[:house].to_i)
      return [200, game.houses.join(' ')]
    else
      return [403, "Either it's not your turn, or you can't start at that house"]
    end
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