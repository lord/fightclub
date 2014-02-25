class Mancala
  STARTING_SEEDS = 6
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

  def ready?
    status[0] && status[1]
  end

  def score(player)
    if player == 0
      @houses[6]
    elsif player == 1
      @houses[13]
    else
      nil
    end
  end

  def side_empty?(player)
    offset = player == 1 ? 7 : 0

    (offset..offset + 5).each do |house_num|
      if @houses[house_num] != 0
        return false
      end
    end

    true
  end

  def finished?
    side_empty?(1) || side_empty?(0)
  end

  def move(player, house)

    # make sure house is valid, and player is either 0 or 1
    if player == 0 and !(0..5).include? house
      return false
    elsif player == 1 and !(7..12).include? house
      return false
    elsif ! [0,1].include? player
      return false
    end

    # make sure it's the player's turn to move
    if player != @turn
      return false
    end

    # make sure that the player hasn't chosen an empty house
    if @houses[house] == 0
      return false
    end

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

    # Capture pieces if last one lands in a empty house on the player's side
    if ((0..5).include? house) && (player == 0) && (@houses[house] == 1)
      @houses[6] += @houses[12-house] + 1
      @houses[house] = 0
      @houses[12-house] = 0
    elsif ((7..12).include? house) && (player == 1) && (@houses[house] == 1)
      @houses[13] += @houses[12-house] + 1
      @houses[house] = 0
      @houses[12-house] = 0
    end

    # Swap the turns if the player didn't finish in the keep
    # I think the finishing in the keep not changing the turn thing might be broken
    @turn = (player + 1) % 2 unless house == 6 or house == 13

    # If the game is over, put remaining pieces in that player's Mancala
    if finished?
      (0..5).each do |house_num|
        @houses[6] += @houses[house_num]
        @houses[house_num] = 0
      end

      (7..12).each do |house_num|
        @houses[13] += @houses[house_num]
        @houses[house_num] = 0
      end
    end

    true
  end
end
