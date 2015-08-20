$(document).ready(function() {
  var clickHandler = function(e) {
    var $parent = $(this).parent();
    var $clone = $parent.clone();
    $clone.find('input').val('');
    $parent.after($clone);

    $('.add').off('click');
    $('.add').on('click', clickHandler);

    $('input[name="urls[]"]').off('keydown.bindKeys');
    $('input[name="urls[]"]').on('keydown.bindKeys', keyDownHandler);
  }

  var keyDownHandler = function(e) {
    if (e.keyCode == 13) {
      $('.input-group:last-child .add').trigger('click');
      $('.input-group:last-child input').focus();
      return false;
    }
  }

  $('.add').on('click', clickHandler);
  $('input[name="urls[]"]').on('keydown.bindKeys', keyDownHandler);
});