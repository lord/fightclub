// $(function() {
  // window.setTimeout(function() {
  //   $('body').text("hello world");
  // }, 5000);
  $('#button_id').click(function () {
    $('#id_prompt').hide();
    wait_for_turn();
    return false;
  });
  $('#button_move').click(function () {
    $.ajax({
      url:'/mancala/move',
      data: {
        player_id: $('#playerID').val(),
        house: $('#move').val()
      },
      success: function(state) {
        set_scores(state);
        $('#move_prompt').hide();
        wait_for_turn();
      },
      error: function(ignore, error_msg) {
        $('#display').append('<br>No!  You FOOL!!!<br>');
      }
    });
    return false;
  });

  function set_scores(scores_string) {
    var scores = scores_string.split(' ');
    $('.cell').each(function() {
      console.log(scores[parseInt($(this).data('house-number'))]);
      $(this).text(scores[parseInt($(this).data('house-number'))]);
    });
  }

  function wait_for_turn() {
    $('#wait_message').show();
    $.ajax({
      url:'/mancala/status',
      data: { player_id: $('#playerID').val()},
      success: function(state) {
        if (state === 'waiting') {
          setTimeout(wait_for_turn, 200);
        }
        else {
          $('#wait_message').hide();
          set_scores(state);
          $('#move_prompt').show();
        }
      }
    });
  }
// });
