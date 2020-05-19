document.addEventListener("DOMContentLoaded", function() {

  /* Фоновое изображение */
  function ibg() {
    $.each($('.ibg'), function(index, val) {
      if ($(this).find('img').length > 0) {
        $(this).css('background-image', 'url("' + $(this).find('img').attr('src') + '")');
      }
    });
  }
  ibg();










  /* Пасхалка? */
  let str = 'Привет от RimmeiQQ 😜';
  let style = ['padding: 1rem;',
    // 'background: #000;',
    'font: 2rem/3 Georgia;',
    'color: #485580;'
  ].join('');
  console.info('%c%s', style, str);

});