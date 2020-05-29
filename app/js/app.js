document.addEventListener("DOMContentLoaded", function () {

  /* Фоновое изображение */
  function ibg() {
    $.each($('.ibg'), function (index, val) {
      if ($(this).find('img').length > 0) {
        $(this).css('background-image', 'url("' + $(this).find('img').attr('src') + '")');
      }
    });
  }
  ibg();



  /* Гамбургер */
  $('.humburger').click(function (e) {
    $('.humburger').stop().toggleClass('humburger__active');
  });
  $(document).on('click', function (e) {
    if (!$(e.target).closest(".humburger").length) {
      $(".humburger").removeClass("humburger__active");
    }
    e.stopPropagation();
  });


  /* input */
  $('.validate-form input').each(function () {
    $(this).on('blur', function () {
      if ($(this).val().trim() != "") {
        $(this).addClass('has-val');
      }
      else {
        $(this).removeClass('has-val');
      }
    })
  })
  /* validate */
  let input = $('.validate-input input');

  $('.validate-form').on('submit', function () {
    let check = true;
    for (let i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }
    return check;
  });

  $('.validate-form input').each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    }
    else {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
  }


  /* button */
  let buttons = document.getElementsByClassName('btn'),
    forEach = Array.prototype.forEach;

  forEach.call(buttons, function (b) {
    b.addEventListener('click', addElement);
  });

  function addElement(e) {
    let addDiv = document.createElement('div'),
      mValue = Math.max(this.clientWidth, this.clientHeight),
      rect = this.getBoundingClientRect();
    sDiv = addDiv.style,
      px = 'px';

    sDiv.width = sDiv.height = mValue + px;
    sDiv.left = e.clientX - rect.left - (mValue / 2) + px;
    sDiv.top = e.clientY - rect.top - (mValue / 2) + px;

    addDiv.classList.add('pulse');
    this.appendChild(addDiv);
  }






  /* Пасхалка? */
  let str = 'Привет от RimmeiQQ 😜';
  let style = ['padding: 1rem;',
    // 'background: #000;',
    'font: 2rem/3 Georgia;',
    'color: #485580;'
  ].join('');
  console.info('%c%s', style, str);

});