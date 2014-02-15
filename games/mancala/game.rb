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

  def scores
    [@houses[6], @houses[13]]
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
    true
  end
end
